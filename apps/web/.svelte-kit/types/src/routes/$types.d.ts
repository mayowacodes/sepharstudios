import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type LayoutRouteId = RouteId | "/(admin)/admin" | "/(admin)/admin/analytics" | "/(admin)/admin/communications" | "/(admin)/admin/content" | "/(admin)/admin/creators" | "/(admin)/admin/dashboard" | "/(admin)/admin/governance" | "/(admin)/admin/governance/create" | "/(admin)/admin/governance/emergency" | "/(admin)/admin/governance/execution" | "/(admin)/admin/governance/proposals" | "/(admin)/admin/governance/reports" | "/(admin)/admin/governance/roles" | "/(admin)/admin/governance/treasury" | "/(admin)/admin/policies" | "/(admin)/admin/review" | "/(admin)/admin/review/[id]" | "/(admin)/admin/settings" | "/(admin)/admin/test" | "/(admin)/admin/tokenomics" | "/(admin)/admin/workflow" | "/(app)" | "/(app)/about" | "/(app)/archive" | "/(app)/careers" | "/(app)/checkout" | "/(app)/contact" | "/(app)/device-support" | "/(app)/documentaries" | "/(app)/faq" | "/(app)/features" | "/(app)/guidelines" | "/(app)/help" | "/(app)/mayowa" | "/(app)/movies" | "/(app)/my-studios" | "/(app)/offline" | "/(app)/plans" | "/(app)/press" | "/(app)/privacy" | "/(app)/shows" | "/(app)/sponsorships" | "/(app)/terms" | "/(app)/token" | "/(auth)/auth/forget-password" | "/(auth)/auth/forget-password/success" | "/(auth)/auth/login" | "/(auth)/auth/register" | "/(auth)/auth/reset-password" | "/(creator)/creator" | "/(creator)/creator/agreement" | "/(creator)/creator/analytics" | "/(creator)/creator/analytics-help" | "/(creator)/creator/best-practices" | "/(creator)/creator/content" | "/(creator)/creator/earnings" | "/(creator)/creator/events" | "/(creator)/creator/forum" | "/(creator)/creator/guidelines" | "/(creator)/creator/newsletter" | "/(creator)/creator/profile" | "/(creator)/creator/success-stories" | "/(creator)/creator/support" | "/(creator)/creator/tech-support" | "/(creator)/creator/test" | "/(creator)/creator/upload" | "/(protected)/achievements" | "/(protected)/dashboard" | "/(protected)/documentation" | "/(protected)/milestones" | "/(protected)/parental-controls" | "/(protected)/profile" | "/(protected)/profiles" | "/(protected)/settings" | "/(protected)/users" | "/(protected)/watchlist" | "/(web3)/subscription" | "/(web3)/tokens" | "/(web3)/wallet" | "/kids/kiddies" | "/kids/kiddies/bible-quiz" | "/kids/kiddies/documentaries" | "/kids/kiddies/movies" | "/kids/kiddies/profile" | "/kids/kiddies/shows" | "/kids/teens" | "/watch/[id]" | null
type LayoutParams = RouteParams & { id?: string }
type LayoutServerParentData = EnsureDefined<{}>;
type LayoutParentData = EnsureDefined<{}>;

export type LayoutServerLoad<OutputData extends OutputDataShape<LayoutServerParentData> = OutputDataShape<LayoutServerParentData>> = Kit.ServerLoad<LayoutParams, LayoutServerParentData, OutputData, LayoutRouteId>;
export type LayoutServerLoadEvent = Parameters<LayoutServerLoad>[0];
export type LayoutServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('./proxy+layout.server.js').load>>>>>>;
export type LayoutData = Expand<Omit<LayoutParentData, keyof LayoutServerData> & EnsureDefined<LayoutServerData>>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;