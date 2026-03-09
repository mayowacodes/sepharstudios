import type { User, Session } from "$lib/auth";

declare global {
	namespace App {
		interface Locals {
			auth: {
				getSession: () => Promise<{ user: User; session: Session } | null>;
				validate: () => Promise<{ user: User; session: Session } | null>;
			};
			user: User | undefined;
			session: Session | undefined;
			subdomain: 'app' | 'admin' | 'creator' | 'kids';
			deviceType: 'desktop' | 'tablet' | 'mobile' | 'tv';
			activeProfileId: string | undefined;
		}
	}
}

export {};
