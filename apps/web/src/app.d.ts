import type { User, Session } from "$lib/auth";

declare global {
	namespace App {
		interface Locals {
			user: User | undefined;
			session: Session | undefined;
			subdomain: 'app' | 'admin' | 'creator' | 'kids';
			deviceType: 'desktop' | 'tablet' | 'mobile' | 'tv';
		}
	}
}

export {};
