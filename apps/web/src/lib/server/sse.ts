/**
 * Minimal in-process SSE broadcaster.
 *
 * Used by the encoder webhook + cron to push job updates to subscribed
 * dashboards (creator upload wizard, content list, admin system-health).
 * Single-instance only — for multi-instance deployments swap the Map for
 * a Redis pub/sub bridge with the same publish/subscribe shape.
 *
 * Topics are arbitrary strings. The encoder layer uses:
 *   `encoder:all`            — admin system-health watches every job
 *   `encoder:creator:<id>`   — creator dashboards watch only their own jobs
 */

type Subscriber = (chunk: string) => void;

const topics = new Map<string, Set<Subscriber>>();

export function subscribe(topic: string, sub: Subscriber): () => void {
	let set = topics.get(topic);
	if (!set) {
		set = new Set();
		topics.set(topic, set);
	}
	set.add(sub);
	return () => {
		const s = topics.get(topic);
		if (s) {
			s.delete(sub);
			if (s.size === 0) topics.delete(topic);
		}
	};
}

export function publish(topic: string, data: unknown): void {
	const set = topics.get(topic);
	if (!set || set.size === 0) return;
	const payload = `data: ${JSON.stringify(data)}\n\n`;
	for (const sub of set) {
		try { sub(payload); } catch { /* dead subscriber; cleanup is the unsubscriber's job */ }
	}
}

/**
 * Build a Response wrapping an EventStream for the listed topics.
 * Handles unsubscribe on close, plus a periodic keep-alive comment so
 * proxies don't timeout the connection.
 */
export function eventStream(topicNames: string[]): Response {
	const encoder = new TextEncoder();
	let unsubscribes: Array<() => void> = [];
	let keepAlive: ReturnType<typeof setInterval> | null = null;

	const stream = new ReadableStream({
		start(controller) {
			const push = (chunk: string) => {
				try { controller.enqueue(encoder.encode(chunk)); } catch { /* stream closed */ }
			};
			// Initial comment kicks the connection open immediately.
			push(': open\n\n');
			for (const t of topicNames) {
				unsubscribes.push(subscribe(t, push));
			}
			keepAlive = setInterval(() => push(': keepalive\n\n'), 25_000);
		},
		cancel() {
			for (const u of unsubscribes) u();
			unsubscribes = [];
			if (keepAlive) { clearInterval(keepAlive); keepAlive = null; }
		}
	});

	return new Response(stream, {
		headers: {
			'content-type': 'text/event-stream',
			'cache-control': 'no-cache, no-transform',
			'connection': 'keep-alive',
			'x-accel-buffering': 'no'
		}
	});
}
