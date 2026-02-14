
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(web3)" | "/(protected)" | "/(kids)" | "/(creator)" | "/(auth)" | "/(app)" | "/(admin)" | "/" | "/(app)/about" | "/(admin)/admin" | "/(admin)/admin/analytics" | "/(admin)/admin/communications" | "/(admin)/admin/content" | "/(admin)/admin/creators" | "/(admin)/admin/dashboard" | "/(admin)/admin/policies" | "/(admin)/admin/review" | "/(admin)/admin/review/[id]" | "/(admin)/admin/settings" | "/(admin)/admin/test" | "/(admin)/admin/tokenomics" | "/(admin)/admin/workflow" | "/api" | "/api/auth" | "/api/auth/[...all]" | "/api/files" | "/api/users" | "/(app)/archive" | "/(auth)/auth" | "/(auth)/auth/forget-password" | "/(auth)/auth/forget-password/success" | "/(auth)/auth/login" | "/(auth)/auth/register" | "/(auth)/auth/reset-password" | "/(app)/contact" | "/(creator)/creator" | "/(creator)/creator/agreement" | "/(creator)/creator/analytics-help" | "/(creator)/creator/analytics" | "/(creator)/creator/best-practices" | "/(creator)/creator/content" | "/(creator)/creator/earnings" | "/(creator)/creator/events" | "/(creator)/creator/forum" | "/(creator)/creator/guidelines" | "/(creator)/creator/newsletter" | "/(creator)/creator/profile" | "/(creator)/creator/success-stories" | "/(creator)/creator/support" | "/(creator)/creator/tech-support" | "/(creator)/creator/test" | "/(creator)/creator/upload" | "/(protected)/dashboard" | "/(app)/documentaries" | "/(protected)/documentation" | "/(app)/faq" | "/(app)/features" | "/(app)/guidelines" | "/(app)/help" | "/(kids)/kiddies" | "/(kids)/kids" | "/(kids)/kids/documentaries" | "/(kids)/kids/movies" | "/(kids)/kids/profile" | "/(kids)/kids/shows" | "/(app)/mayowa" | "/(app)/movies" | "/(app)/my-studios" | "/(app)/offline" | "/(app)/plans" | "/(app)/press" | "/(app)/privacy" | "/(protected)/profile" | "/(app)/shows" | "/(app)/sponsorships" | "/(web3)/subscription" | "/(app)/terms" | "/(web3)/tokens" | "/(protected)/users" | "/(protected)/users/components" | "/(web3)/wallet";
		RouteParams(): {
			"/(admin)/admin/review/[id]": { id: string };
			"/api/auth/[...all]": { all: string }
		};
		LayoutParams(): {
			"/(web3)": Record<string, never>;
			"/(protected)": Record<string, never>;
			"/(kids)": Record<string, never>;
			"/(creator)": Record<string, never>;
			"/(auth)": Record<string, never>;
			"/(app)": Record<string, never>;
			"/(admin)": { id?: string };
			"/": { id?: string; all?: string };
			"/(app)/about": Record<string, never>;
			"/(admin)/admin": { id?: string };
			"/(admin)/admin/analytics": Record<string, never>;
			"/(admin)/admin/communications": Record<string, never>;
			"/(admin)/admin/content": Record<string, never>;
			"/(admin)/admin/creators": Record<string, never>;
			"/(admin)/admin/dashboard": Record<string, never>;
			"/(admin)/admin/policies": Record<string, never>;
			"/(admin)/admin/review": { id?: string };
			"/(admin)/admin/review/[id]": { id: string };
			"/(admin)/admin/settings": Record<string, never>;
			"/(admin)/admin/test": Record<string, never>;
			"/(admin)/admin/tokenomics": Record<string, never>;
			"/(admin)/admin/workflow": Record<string, never>;
			"/api": { all?: string };
			"/api/auth": { all?: string };
			"/api/auth/[...all]": { all: string };
			"/api/files": Record<string, never>;
			"/api/users": Record<string, never>;
			"/(app)/archive": Record<string, never>;
			"/(auth)/auth": Record<string, never>;
			"/(auth)/auth/forget-password": Record<string, never>;
			"/(auth)/auth/forget-password/success": Record<string, never>;
			"/(auth)/auth/login": Record<string, never>;
			"/(auth)/auth/register": Record<string, never>;
			"/(auth)/auth/reset-password": Record<string, never>;
			"/(app)/contact": Record<string, never>;
			"/(creator)/creator": Record<string, never>;
			"/(creator)/creator/agreement": Record<string, never>;
			"/(creator)/creator/analytics-help": Record<string, never>;
			"/(creator)/creator/analytics": Record<string, never>;
			"/(creator)/creator/best-practices": Record<string, never>;
			"/(creator)/creator/content": Record<string, never>;
			"/(creator)/creator/earnings": Record<string, never>;
			"/(creator)/creator/events": Record<string, never>;
			"/(creator)/creator/forum": Record<string, never>;
			"/(creator)/creator/guidelines": Record<string, never>;
			"/(creator)/creator/newsletter": Record<string, never>;
			"/(creator)/creator/profile": Record<string, never>;
			"/(creator)/creator/success-stories": Record<string, never>;
			"/(creator)/creator/support": Record<string, never>;
			"/(creator)/creator/tech-support": Record<string, never>;
			"/(creator)/creator/test": Record<string, never>;
			"/(creator)/creator/upload": Record<string, never>;
			"/(protected)/dashboard": Record<string, never>;
			"/(app)/documentaries": Record<string, never>;
			"/(protected)/documentation": Record<string, never>;
			"/(app)/faq": Record<string, never>;
			"/(app)/features": Record<string, never>;
			"/(app)/guidelines": Record<string, never>;
			"/(app)/help": Record<string, never>;
			"/(kids)/kiddies": Record<string, never>;
			"/(kids)/kids": Record<string, never>;
			"/(kids)/kids/documentaries": Record<string, never>;
			"/(kids)/kids/movies": Record<string, never>;
			"/(kids)/kids/profile": Record<string, never>;
			"/(kids)/kids/shows": Record<string, never>;
			"/(app)/mayowa": Record<string, never>;
			"/(app)/movies": Record<string, never>;
			"/(app)/my-studios": Record<string, never>;
			"/(app)/offline": Record<string, never>;
			"/(app)/plans": Record<string, never>;
			"/(app)/press": Record<string, never>;
			"/(app)/privacy": Record<string, never>;
			"/(protected)/profile": Record<string, never>;
			"/(app)/shows": Record<string, never>;
			"/(app)/sponsorships": Record<string, never>;
			"/(web3)/subscription": Record<string, never>;
			"/(app)/terms": Record<string, never>;
			"/(web3)/tokens": Record<string, never>;
			"/(protected)/users": Record<string, never>;
			"/(protected)/users/components": Record<string, never>;
			"/(web3)/wallet": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/analytics" | "/admin/analytics/" | "/admin/communications" | "/admin/communications/" | "/admin/content" | "/admin/content/" | "/admin/creators" | "/admin/creators/" | "/admin/dashboard" | "/admin/dashboard/" | "/admin/policies" | "/admin/policies/" | "/admin/review" | "/admin/review/" | `/admin/review/${string}` & {} | `/admin/review/${string}/` & {} | "/admin/settings" | "/admin/settings/" | "/admin/test" | "/admin/test/" | "/admin/tokenomics" | "/admin/tokenomics/" | "/admin/workflow" | "/admin/workflow/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | `/api/auth/${string}` & {} | `/api/auth/${string}/` & {} | "/api/files" | "/api/files/" | "/api/users" | "/api/users/" | "/archive" | "/archive/" | "/auth" | "/auth/" | "/auth/forget-password" | "/auth/forget-password/" | "/auth/forget-password/success" | "/auth/forget-password/success/" | "/auth/login" | "/auth/login/" | "/auth/register" | "/auth/register/" | "/auth/reset-password" | "/auth/reset-password/" | "/contact" | "/contact/" | "/creator" | "/creator/" | "/creator/agreement" | "/creator/agreement/" | "/creator/analytics-help" | "/creator/analytics-help/" | "/creator/analytics" | "/creator/analytics/" | "/creator/best-practices" | "/creator/best-practices/" | "/creator/content" | "/creator/content/" | "/creator/earnings" | "/creator/earnings/" | "/creator/events" | "/creator/events/" | "/creator/forum" | "/creator/forum/" | "/creator/guidelines" | "/creator/guidelines/" | "/creator/newsletter" | "/creator/newsletter/" | "/creator/profile" | "/creator/profile/" | "/creator/success-stories" | "/creator/success-stories/" | "/creator/support" | "/creator/support/" | "/creator/tech-support" | "/creator/tech-support/" | "/creator/test" | "/creator/test/" | "/creator/upload" | "/creator/upload/" | "/dashboard" | "/dashboard/" | "/documentaries" | "/documentaries/" | "/documentation" | "/documentation/" | "/faq" | "/faq/" | "/features" | "/features/" | "/guidelines" | "/guidelines/" | "/help" | "/help/" | "/kiddies" | "/kiddies/" | "/kids" | "/kids/" | "/kids/documentaries" | "/kids/documentaries/" | "/kids/movies" | "/kids/movies/" | "/kids/profile" | "/kids/profile/" | "/kids/shows" | "/kids/shows/" | "/mayowa" | "/mayowa/" | "/movies" | "/movies/" | "/my-studios" | "/my-studios/" | "/offline" | "/offline/" | "/plans" | "/plans/" | "/press" | "/press/" | "/privacy" | "/privacy/" | "/profile" | "/profile/" | "/shows" | "/shows/" | "/sponsorships" | "/sponsorships/" | "/subscription" | "/subscription/" | "/terms" | "/terms/" | "/tokens" | "/tokens/" | "/users" | "/users/" | "/users/components" | "/users/components/" | "/wallet" | "/wallet/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/manifest.json" | "/robots.txt" | string & {};
	}
}