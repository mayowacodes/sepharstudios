import { env as publicEnv } from '$env/dynamic/public';

/**
 * Browser-side Web Push subscription helpers.
 *
 * Flow:
 *   1. enablePush() — asks for permission, gets a PushSubscription,
 *      POSTs to /api/push/subscribe.
 *   2. disablePush() — unsubscribes locally + DELETE on the server row.
 *
 * Use isPushSupported() before showing toggle UI — Safari < 16, in-app
 * browsers, and old WebView builds will fail PushManager checks.
 */

export function isPushSupported(): boolean {
	if (typeof window === 'undefined') return false;
	return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
	const padding = '='.repeat((4 - (base64.length % 4)) % 4);
	const norm = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
	const raw = atob(norm);
	const out = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
	return out;
}

function urlBase64ToArrayBuffer(base64: string): ArrayBuffer {
	const bytes = urlBase64ToUint8Array(base64);
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
	const existing = await navigator.serviceWorker.getRegistration('/');
	if (existing) return existing;
	return navigator.serviceWorker.register('/sw.js');
}

export async function enablePush(): Promise<{ ok: boolean; reason?: string }> {
	if (!isPushSupported()) return { ok: false, reason: 'Push is not supported in this browser.' };
	const pubKey = publicEnv.PUBLIC_VAPID_PUBLIC_KEY;
	if (!pubKey) return { ok: false, reason: 'VAPID public key is not configured on this site.' };

	const permission = await Notification.requestPermission();
	if (permission !== 'granted') return { ok: false, reason: 'Notification permission was not granted.' };

	const reg = await getRegistration();
	let subscription = await reg.pushManager.getSubscription();
	if (!subscription) {
		subscription = await reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToArrayBuffer(pubKey)
		});
	}

	const res = await fetch('/api/push/subscribe', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(subscription.toJSON())
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		return { ok: false, reason: err.error ?? `Server rejected the subscription (${res.status})` };
	}
	return { ok: true };
}

export async function disablePush(): Promise<{ ok: boolean }> {
	if (!isPushSupported()) return { ok: true };
	const reg = await navigator.serviceWorker.getRegistration('/');
	if (!reg) return { ok: true };
	const sub = await reg.pushManager.getSubscription();
	if (!sub) return { ok: true };

	await fetch('/api/push/subscribe', {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ endpoint: sub.endpoint })
	}).catch(() => undefined);
	await sub.unsubscribe();
	return { ok: true };
}

export async function isPushEnabled(): Promise<boolean> {
	if (!isPushSupported()) return false;
	if (Notification.permission !== 'granted') return false;
	const reg = await navigator.serviceWorker.getRegistration('/');
	if (!reg) return false;
	const sub = await reg.pushManager.getSubscription();
	return !!sub;
}
