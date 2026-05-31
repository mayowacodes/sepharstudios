import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;
type RouteParams = {  };
type RouteId = '/(admin)/admin';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = Omit<EnsureDefined<import('../../$types.js').LayoutData>, keyof LayoutData> & EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/(admin)/admin" | "/(admin)/admin/abuse" | "/(admin)/admin/ai-runs" | "/(admin)/admin/analytics" | "/(admin)/admin/communications" | "/(admin)/admin/content" | "/(admin)/admin/creator-applications" | "/(admin)/admin/creators" | "/(admin)/admin/dashboard" | "/(admin)/admin/disputes" | "/(admin)/admin/events" | "/(admin)/admin/governance" | "/(admin)/admin/governance/create" | "/(admin)/admin/governance/emergency" | "/(admin)/admin/governance/execution" | "/(admin)/admin/governance/proposals" | "/(admin)/admin/governance/reports" | "/(admin)/admin/governance/roles" | "/(admin)/admin/governance/treasury" | "/(admin)/admin/payouts" | "/(admin)/admin/policies" | "/(admin)/admin/refunds" | "/(admin)/admin/review" | "/(admin)/admin/review/[id]" | "/(admin)/admin/settings" | "/(admin)/admin/submissions" | "/(admin)/admin/system-health" | "/(admin)/admin/tax-forms" | "/(admin)/admin/tokenomics" | "/(admin)/admin/users" | "/(admin)/admin/users/[id]" | "/(admin)/admin/workflow"
type LayoutParams = RouteParams & { id?: string | undefined }
type LayoutParentData = EnsureDefined<import('../../$types.js').LayoutData>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type PageProps = { params: RouteParams; data: PageData }
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }