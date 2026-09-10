import type { User, Session } from "$lib/auth";
import type { EIP1193Provider } from "viem";

declare global {
	namespace App {
		interface Locals {
			auth: {
				getSession: () => Promise<{ user: User; session: Session } | null>;
			};
			user: User | undefined;
			session: Session | undefined;
			subdomain: 'app' | 'admin' | 'creator' | 'kids';
			deviceType: 'desktop' | 'tablet' | 'mobile' | 'tv';
			activeProfileId: string | undefined;
		}
	}

	interface Window {
		ethereum?: EIP1193Provider;
	}

	/**
	 * True in the Capacitor/Tauri bundle (BUILD_TARGET=static), false in the
	 * Docker/adapter-node web build. Inlined by vite `define`, so branches on
	 * it are dead-code-eliminated per target rather than shipped to both.
	 */
	const __NATIVE_BUILD__: boolean;

	/**
	 * Origin that serves /api/*. Empty string on web (same-origin); the
	 * deployed https origin in the native bundles.
	 */
	const __API_ORIGIN__: string;
}

export {};
