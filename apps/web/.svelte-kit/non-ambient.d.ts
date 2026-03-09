
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
		RouteId(): "/(web3)" | "/(protected)" | "/(creator)" | "/(auth)" | "/(app)" | "/(admin)" | "/" | "/(app)/about" | "/(protected)/achievements" | "/(admin)/admin" | "/(admin)/admin/analytics" | "/(admin)/admin/communications" | "/(admin)/admin/content" | "/(admin)/admin/creators" | "/(admin)/admin/dashboard" | "/(admin)/admin/governance" | "/(admin)/admin/governance/create" | "/(admin)/admin/governance/emergency" | "/(admin)/admin/governance/execution" | "/(admin)/admin/governance/proposals" | "/(admin)/admin/governance/reports" | "/(admin)/admin/governance/roles" | "/(admin)/admin/governance/treasury" | "/(admin)/admin/policies" | "/(admin)/admin/review" | "/(admin)/admin/review/[id]" | "/(admin)/admin/settings" | "/(admin)/admin/test" | "/(admin)/admin/tokenomics" | "/(admin)/admin/workflow" | "/api" | "/api/achievements" | "/api/admin" | "/api/admin/content" | "/api/admin/content/[id]" | "/api/admin/content/[id]/ppv" | "/api/admin/content/[id]/publish" | "/api/admin/governance" | "/api/admin/governance/approve" | "/api/admin/governance/audit" | "/api/admin/governance/emergency" | "/api/admin/governance/emergency/pause" | "/api/admin/governance/execute" | "/api/admin/governance/proposals" | "/api/admin/governance/queue" | "/api/admin/governance/reports" | "/api/admin/governance/roles" | "/api/admin/governance/status" | "/api/admin/governance/timelock-queue" | "/api/admin/governance/treasury" | "/api/admin/reviews" | "/api/auth" | "/api/auth/[...all]" | "/api/content" | "/api/content/kids" | "/api/creator" | "/api/creator/content" | "/api/downloads" | "/api/downloads/manifest" | "/api/downloads/manifest/[id]" | "/api/encoder" | "/api/encoder/presigned" | "/api/encoder/process" | "/api/files" | "/api/kids" | "/api/kids/quiz" | "/api/kids/quiz/generate" | "/api/kids/quiz/submit" | "/api/milestones" | "/api/notifications" | "/api/notifications/preferences" | "/api/parental" | "/api/parental/report" | "/api/payment" | "/api/payment/initialize" | "/api/payment/verify" | "/api/payment/webhook" | "/api/playlists" | "/api/playlists/[id]" | "/api/playlists/[id]/items" | "/api/ppv" | "/api/ppv/check-access" | "/api/ppv/check-access/[contentId]" | "/api/ppv/purchase" | "/api/profiles" | "/api/profiles/[id]" | "/api/profiles/[id]/pin" | "/api/recommendations" | "/api/reviews" | "/api/reviews/[id]" | "/api/reviews/[id]/helpful" | "/api/subscriptions" | "/api/subscriptions/add-family" | "/api/subscriptions/cancel" | "/api/subscriptions/change-plan" | "/api/subscriptions/send-otp" | "/api/subscriptions/start-trial" | "/api/subscriptions/status" | "/api/users" | "/api/watch" | "/api/watch/history" | "/api/watch/progress" | "/api/watch/[videoId]" | "/(app)/archive" | "/(auth)/auth" | "/(auth)/auth/forget-password" | "/(auth)/auth/forget-password/success" | "/(auth)/auth/login" | "/(auth)/auth/register" | "/(auth)/auth/reset-password" | "/(app)/careers" | "/(app)/checkout" | "/(app)/contact" | "/(creator)/creator" | "/(creator)/creator/agreement" | "/(creator)/creator/analytics-help" | "/(creator)/creator/analytics" | "/(creator)/creator/best-practices" | "/(creator)/creator/content" | "/(creator)/creator/earnings" | "/(creator)/creator/events" | "/(creator)/creator/forum" | "/(creator)/creator/guidelines" | "/(creator)/creator/newsletter" | "/(creator)/creator/profile" | "/(creator)/creator/success-stories" | "/(creator)/creator/support" | "/(creator)/creator/tech-support" | "/(creator)/creator/test" | "/(creator)/creator/upload" | "/(protected)/dashboard" | "/(app)/device-support" | "/(app)/documentaries" | "/(protected)/documentation" | "/(app)/faq" | "/(app)/features" | "/(app)/guidelines" | "/(app)/help" | "/kids" | "/kids/kiddies" | "/kids/kiddies/bible-quiz" | "/kids/kiddies/documentaries" | "/kids/kiddies/movies" | "/kids/kiddies/profile" | "/kids/kiddies/shows" | "/kids/teens" | "/(app)/mayowa" | "/(protected)/milestones" | "/(app)/movies" | "/(app)/my-studios" | "/(app)/offline" | "/(protected)/parental-controls" | "/(app)/plans" | "/(app)/press" | "/(app)/privacy" | "/(protected)/profiles" | "/(protected)/profile" | "/(protected)/settings" | "/(app)/shows" | "/(app)/sponsorships" | "/(web3)/subscription" | "/(app)/terms" | "/(web3)/tokens" | "/(app)/token" | "/(protected)/users" | "/(protected)/users/components" | "/(web3)/wallet" | "/(protected)/watchlist" | "/watch" | "/watch/[id]";
		RouteParams(): {
			"/(admin)/admin/review/[id]": { id: string };
			"/api/admin/content/[id]": { id: string };
			"/api/admin/content/[id]/ppv": { id: string };
			"/api/admin/content/[id]/publish": { id: string };
			"/api/auth/[...all]": { all: string };
			"/api/downloads/manifest/[id]": { id: string };
			"/api/playlists/[id]": { id: string };
			"/api/playlists/[id]/items": { id: string };
			"/api/ppv/check-access/[contentId]": { contentId: string };
			"/api/profiles/[id]": { id: string };
			"/api/profiles/[id]/pin": { id: string };
			"/api/reviews/[id]": { id: string };
			"/api/reviews/[id]/helpful": { id: string };
			"/api/watch/[videoId]": { videoId: string };
			"/watch/[id]": { id: string }
		};
		LayoutParams(): {
			"/(web3)": Record<string, never>;
			"/(protected)": Record<string, never>;
			"/(creator)": Record<string, never>;
			"/(auth)": Record<string, never>;
			"/(app)": Record<string, never>;
			"/(admin)": { id?: string };
			"/": { id?: string; all?: string; contentId?: string; videoId?: string };
			"/(app)/about": Record<string, never>;
			"/(protected)/achievements": Record<string, never>;
			"/(admin)/admin": { id?: string };
			"/(admin)/admin/analytics": Record<string, never>;
			"/(admin)/admin/communications": Record<string, never>;
			"/(admin)/admin/content": Record<string, never>;
			"/(admin)/admin/creators": Record<string, never>;
			"/(admin)/admin/dashboard": Record<string, never>;
			"/(admin)/admin/governance": Record<string, never>;
			"/(admin)/admin/governance/create": Record<string, never>;
			"/(admin)/admin/governance/emergency": Record<string, never>;
			"/(admin)/admin/governance/execution": Record<string, never>;
			"/(admin)/admin/governance/proposals": Record<string, never>;
			"/(admin)/admin/governance/reports": Record<string, never>;
			"/(admin)/admin/governance/roles": Record<string, never>;
			"/(admin)/admin/governance/treasury": Record<string, never>;
			"/(admin)/admin/policies": Record<string, never>;
			"/(admin)/admin/review": { id?: string };
			"/(admin)/admin/review/[id]": { id: string };
			"/(admin)/admin/settings": Record<string, never>;
			"/(admin)/admin/test": Record<string, never>;
			"/(admin)/admin/tokenomics": Record<string, never>;
			"/(admin)/admin/workflow": Record<string, never>;
			"/api": { id?: string; all?: string; contentId?: string; videoId?: string };
			"/api/achievements": Record<string, never>;
			"/api/admin": { id?: string };
			"/api/admin/content": { id?: string };
			"/api/admin/content/[id]": { id: string };
			"/api/admin/content/[id]/ppv": { id: string };
			"/api/admin/content/[id]/publish": { id: string };
			"/api/admin/governance": Record<string, never>;
			"/api/admin/governance/approve": Record<string, never>;
			"/api/admin/governance/audit": Record<string, never>;
			"/api/admin/governance/emergency": Record<string, never>;
			"/api/admin/governance/emergency/pause": Record<string, never>;
			"/api/admin/governance/execute": Record<string, never>;
			"/api/admin/governance/proposals": Record<string, never>;
			"/api/admin/governance/queue": Record<string, never>;
			"/api/admin/governance/reports": Record<string, never>;
			"/api/admin/governance/roles": Record<string, never>;
			"/api/admin/governance/status": Record<string, never>;
			"/api/admin/governance/timelock-queue": Record<string, never>;
			"/api/admin/governance/treasury": Record<string, never>;
			"/api/admin/reviews": Record<string, never>;
			"/api/auth": { all?: string };
			"/api/auth/[...all]": { all: string };
			"/api/content": Record<string, never>;
			"/api/content/kids": Record<string, never>;
			"/api/creator": Record<string, never>;
			"/api/creator/content": Record<string, never>;
			"/api/downloads": { id?: string };
			"/api/downloads/manifest": { id?: string };
			"/api/downloads/manifest/[id]": { id: string };
			"/api/encoder": Record<string, never>;
			"/api/encoder/presigned": Record<string, never>;
			"/api/encoder/process": Record<string, never>;
			"/api/files": Record<string, never>;
			"/api/kids": Record<string, never>;
			"/api/kids/quiz": Record<string, never>;
			"/api/kids/quiz/generate": Record<string, never>;
			"/api/kids/quiz/submit": Record<string, never>;
			"/api/milestones": Record<string, never>;
			"/api/notifications": Record<string, never>;
			"/api/notifications/preferences": Record<string, never>;
			"/api/parental": Record<string, never>;
			"/api/parental/report": Record<string, never>;
			"/api/payment": Record<string, never>;
			"/api/payment/initialize": Record<string, never>;
			"/api/payment/verify": Record<string, never>;
			"/api/payment/webhook": Record<string, never>;
			"/api/playlists": { id?: string };
			"/api/playlists/[id]": { id: string };
			"/api/playlists/[id]/items": { id: string };
			"/api/ppv": { contentId?: string };
			"/api/ppv/check-access": { contentId?: string };
			"/api/ppv/check-access/[contentId]": { contentId: string };
			"/api/ppv/purchase": Record<string, never>;
			"/api/profiles": { id?: string };
			"/api/profiles/[id]": { id: string };
			"/api/profiles/[id]/pin": { id: string };
			"/api/recommendations": Record<string, never>;
			"/api/reviews": { id?: string };
			"/api/reviews/[id]": { id: string };
			"/api/reviews/[id]/helpful": { id: string };
			"/api/subscriptions": Record<string, never>;
			"/api/subscriptions/add-family": Record<string, never>;
			"/api/subscriptions/cancel": Record<string, never>;
			"/api/subscriptions/change-plan": Record<string, never>;
			"/api/subscriptions/send-otp": Record<string, never>;
			"/api/subscriptions/start-trial": Record<string, never>;
			"/api/subscriptions/status": Record<string, never>;
			"/api/users": Record<string, never>;
			"/api/watch": { videoId?: string };
			"/api/watch/history": Record<string, never>;
			"/api/watch/progress": Record<string, never>;
			"/api/watch/[videoId]": { videoId: string };
			"/(app)/archive": Record<string, never>;
			"/(auth)/auth": Record<string, never>;
			"/(auth)/auth/forget-password": Record<string, never>;
			"/(auth)/auth/forget-password/success": Record<string, never>;
			"/(auth)/auth/login": Record<string, never>;
			"/(auth)/auth/register": Record<string, never>;
			"/(auth)/auth/reset-password": Record<string, never>;
			"/(app)/careers": Record<string, never>;
			"/(app)/checkout": Record<string, never>;
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
			"/(app)/device-support": Record<string, never>;
			"/(app)/documentaries": Record<string, never>;
			"/(protected)/documentation": Record<string, never>;
			"/(app)/faq": Record<string, never>;
			"/(app)/features": Record<string, never>;
			"/(app)/guidelines": Record<string, never>;
			"/(app)/help": Record<string, never>;
			"/kids": Record<string, never>;
			"/kids/kiddies": Record<string, never>;
			"/kids/kiddies/bible-quiz": Record<string, never>;
			"/kids/kiddies/documentaries": Record<string, never>;
			"/kids/kiddies/movies": Record<string, never>;
			"/kids/kiddies/profile": Record<string, never>;
			"/kids/kiddies/shows": Record<string, never>;
			"/kids/teens": Record<string, never>;
			"/(app)/mayowa": Record<string, never>;
			"/(protected)/milestones": Record<string, never>;
			"/(app)/movies": Record<string, never>;
			"/(app)/my-studios": Record<string, never>;
			"/(app)/offline": Record<string, never>;
			"/(protected)/parental-controls": Record<string, never>;
			"/(app)/plans": Record<string, never>;
			"/(app)/press": Record<string, never>;
			"/(app)/privacy": Record<string, never>;
			"/(protected)/profiles": Record<string, never>;
			"/(protected)/profile": Record<string, never>;
			"/(protected)/settings": Record<string, never>;
			"/(app)/shows": Record<string, never>;
			"/(app)/sponsorships": Record<string, never>;
			"/(web3)/subscription": Record<string, never>;
			"/(app)/terms": Record<string, never>;
			"/(web3)/tokens": Record<string, never>;
			"/(app)/token": Record<string, never>;
			"/(protected)/users": Record<string, never>;
			"/(protected)/users/components": Record<string, never>;
			"/(web3)/wallet": Record<string, never>;
			"/(protected)/watchlist": Record<string, never>;
			"/watch": { id?: string };
			"/watch/[id]": { id: string }
		};
		Pathname(): "/" | "/about" | "/about/" | "/achievements" | "/achievements/" | "/admin" | "/admin/" | "/admin/analytics" | "/admin/analytics/" | "/admin/communications" | "/admin/communications/" | "/admin/content" | "/admin/content/" | "/admin/creators" | "/admin/creators/" | "/admin/dashboard" | "/admin/dashboard/" | "/admin/governance" | "/admin/governance/" | "/admin/governance/create" | "/admin/governance/create/" | "/admin/governance/emergency" | "/admin/governance/emergency/" | "/admin/governance/execution" | "/admin/governance/execution/" | "/admin/governance/proposals" | "/admin/governance/proposals/" | "/admin/governance/reports" | "/admin/governance/reports/" | "/admin/governance/roles" | "/admin/governance/roles/" | "/admin/governance/treasury" | "/admin/governance/treasury/" | "/admin/policies" | "/admin/policies/" | "/admin/review" | "/admin/review/" | `/admin/review/${string}` & {} | `/admin/review/${string}/` & {} | "/admin/settings" | "/admin/settings/" | "/admin/test" | "/admin/test/" | "/admin/tokenomics" | "/admin/tokenomics/" | "/admin/workflow" | "/admin/workflow/" | "/api" | "/api/" | "/api/achievements" | "/api/achievements/" | "/api/admin" | "/api/admin/" | "/api/admin/content" | "/api/admin/content/" | `/api/admin/content/${string}` & {} | `/api/admin/content/${string}/` & {} | `/api/admin/content/${string}/ppv` & {} | `/api/admin/content/${string}/ppv/` & {} | `/api/admin/content/${string}/publish` & {} | `/api/admin/content/${string}/publish/` & {} | "/api/admin/governance" | "/api/admin/governance/" | "/api/admin/governance/approve" | "/api/admin/governance/approve/" | "/api/admin/governance/audit" | "/api/admin/governance/audit/" | "/api/admin/governance/emergency" | "/api/admin/governance/emergency/" | "/api/admin/governance/emergency/pause" | "/api/admin/governance/emergency/pause/" | "/api/admin/governance/execute" | "/api/admin/governance/execute/" | "/api/admin/governance/proposals" | "/api/admin/governance/proposals/" | "/api/admin/governance/queue" | "/api/admin/governance/queue/" | "/api/admin/governance/reports" | "/api/admin/governance/reports/" | "/api/admin/governance/roles" | "/api/admin/governance/roles/" | "/api/admin/governance/status" | "/api/admin/governance/status/" | "/api/admin/governance/timelock-queue" | "/api/admin/governance/timelock-queue/" | "/api/admin/governance/treasury" | "/api/admin/governance/treasury/" | "/api/admin/reviews" | "/api/admin/reviews/" | "/api/auth" | "/api/auth/" | `/api/auth/${string}` & {} | `/api/auth/${string}/` & {} | "/api/content" | "/api/content/" | "/api/content/kids" | "/api/content/kids/" | "/api/creator" | "/api/creator/" | "/api/creator/content" | "/api/creator/content/" | "/api/downloads" | "/api/downloads/" | "/api/downloads/manifest" | "/api/downloads/manifest/" | `/api/downloads/manifest/${string}` & {} | `/api/downloads/manifest/${string}/` & {} | "/api/encoder" | "/api/encoder/" | "/api/encoder/presigned" | "/api/encoder/presigned/" | "/api/encoder/process" | "/api/encoder/process/" | "/api/files" | "/api/files/" | "/api/kids" | "/api/kids/" | "/api/kids/quiz" | "/api/kids/quiz/" | "/api/kids/quiz/generate" | "/api/kids/quiz/generate/" | "/api/kids/quiz/submit" | "/api/kids/quiz/submit/" | "/api/milestones" | "/api/milestones/" | "/api/notifications" | "/api/notifications/" | "/api/notifications/preferences" | "/api/notifications/preferences/" | "/api/parental" | "/api/parental/" | "/api/parental/report" | "/api/parental/report/" | "/api/payment" | "/api/payment/" | "/api/payment/initialize" | "/api/payment/initialize/" | "/api/payment/verify" | "/api/payment/verify/" | "/api/payment/webhook" | "/api/payment/webhook/" | "/api/playlists" | "/api/playlists/" | `/api/playlists/${string}` & {} | `/api/playlists/${string}/` & {} | `/api/playlists/${string}/items` & {} | `/api/playlists/${string}/items/` & {} | "/api/ppv" | "/api/ppv/" | "/api/ppv/check-access" | "/api/ppv/check-access/" | `/api/ppv/check-access/${string}` & {} | `/api/ppv/check-access/${string}/` & {} | "/api/ppv/purchase" | "/api/ppv/purchase/" | "/api/profiles" | "/api/profiles/" | `/api/profiles/${string}` & {} | `/api/profiles/${string}/` & {} | `/api/profiles/${string}/pin` & {} | `/api/profiles/${string}/pin/` & {} | "/api/recommendations" | "/api/recommendations/" | "/api/reviews" | "/api/reviews/" | `/api/reviews/${string}` & {} | `/api/reviews/${string}/` & {} | `/api/reviews/${string}/helpful` & {} | `/api/reviews/${string}/helpful/` & {} | "/api/subscriptions" | "/api/subscriptions/" | "/api/subscriptions/add-family" | "/api/subscriptions/add-family/" | "/api/subscriptions/cancel" | "/api/subscriptions/cancel/" | "/api/subscriptions/change-plan" | "/api/subscriptions/change-plan/" | "/api/subscriptions/send-otp" | "/api/subscriptions/send-otp/" | "/api/subscriptions/start-trial" | "/api/subscriptions/start-trial/" | "/api/subscriptions/status" | "/api/subscriptions/status/" | "/api/users" | "/api/users/" | "/api/watch" | "/api/watch/" | "/api/watch/history" | "/api/watch/history/" | "/api/watch/progress" | "/api/watch/progress/" | `/api/watch/${string}` & {} | `/api/watch/${string}/` & {} | "/archive" | "/archive/" | "/auth" | "/auth/" | "/auth/forget-password" | "/auth/forget-password/" | "/auth/forget-password/success" | "/auth/forget-password/success/" | "/auth/login" | "/auth/login/" | "/auth/register" | "/auth/register/" | "/auth/reset-password" | "/auth/reset-password/" | "/careers" | "/careers/" | "/checkout" | "/checkout/" | "/contact" | "/contact/" | "/creator" | "/creator/" | "/creator/agreement" | "/creator/agreement/" | "/creator/analytics-help" | "/creator/analytics-help/" | "/creator/analytics" | "/creator/analytics/" | "/creator/best-practices" | "/creator/best-practices/" | "/creator/content" | "/creator/content/" | "/creator/earnings" | "/creator/earnings/" | "/creator/events" | "/creator/events/" | "/creator/forum" | "/creator/forum/" | "/creator/guidelines" | "/creator/guidelines/" | "/creator/newsletter" | "/creator/newsletter/" | "/creator/profile" | "/creator/profile/" | "/creator/success-stories" | "/creator/success-stories/" | "/creator/support" | "/creator/support/" | "/creator/tech-support" | "/creator/tech-support/" | "/creator/test" | "/creator/test/" | "/creator/upload" | "/creator/upload/" | "/dashboard" | "/dashboard/" | "/device-support" | "/device-support/" | "/documentaries" | "/documentaries/" | "/documentation" | "/documentation/" | "/faq" | "/faq/" | "/features" | "/features/" | "/guidelines" | "/guidelines/" | "/help" | "/help/" | "/kids" | "/kids/" | "/kids/kiddies" | "/kids/kiddies/" | "/kids/kiddies/bible-quiz" | "/kids/kiddies/bible-quiz/" | "/kids/kiddies/documentaries" | "/kids/kiddies/documentaries/" | "/kids/kiddies/movies" | "/kids/kiddies/movies/" | "/kids/kiddies/profile" | "/kids/kiddies/profile/" | "/kids/kiddies/shows" | "/kids/kiddies/shows/" | "/kids/teens" | "/kids/teens/" | "/mayowa" | "/mayowa/" | "/milestones" | "/milestones/" | "/movies" | "/movies/" | "/my-studios" | "/my-studios/" | "/offline" | "/offline/" | "/parental-controls" | "/parental-controls/" | "/plans" | "/plans/" | "/press" | "/press/" | "/privacy" | "/privacy/" | "/profiles" | "/profiles/" | "/profile" | "/profile/" | "/settings" | "/settings/" | "/shows" | "/shows/" | "/sponsorships" | "/sponsorships/" | "/subscription" | "/subscription/" | "/terms" | "/terms/" | "/tokens" | "/tokens/" | "/token" | "/token/" | "/users" | "/users/" | "/users/components" | "/users/components/" | "/wallet" | "/wallet/" | "/watchlist" | "/watchlist/" | "/watch" | "/watch/" | `/watch/${string}` & {} | `/watch/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/asl-logo.png" | "/favicon-96x96.png" | "/favicon.ico" | "/favicon.svg" | "/logo&name-sepharstudios.png" | "/logo-alone-sepharstudios-bgless.png" | "/logo-alone-sepharstudios.png" | "/manifest.json" | "/name-alone-sepharstudios.png" | "/pwa-192x192.png" | "/pwa-512x512.png" | "/pwa-maskable-192x192.png" | "/pwa-maskable-512x512.png" | "/robots.txt" | "/screenshot-mobile.webp" | "/screenshot-wide.webp" | "/sw.js" | string & {};
	}
}