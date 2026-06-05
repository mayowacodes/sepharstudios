import { n as __reExport, t as __exportAll } from "./rolldown-runtime.js";
import { Gt as setContext, St as derived, Ut as getContext, lt as SvelteSet, mt as onDestroy, ut as createSubscriber } from "./ui-libs.js";
import { r as Role } from "./constants.js";
import { InfiniteQueryObserver, MutationObserver, QueriesObserver, QueryClient, QueryObserver, hydrate, noop } from "@tanstack/query-core";
//#region ../../node_modules/@tanstack/svelte-query/dist/context.js
var _contextKey = Symbol("QueryClient");
/** Retrieves a Client from Svelte's context */
var getQueryClientContext = () => {
	const client = getContext(_contextKey);
	if (!client) throw new Error("No QueryClient was found in Svelte context. Did you forget to wrap your component with QueryClientProvider?");
	return client;
};
/** Sets a QueryClient on Svelte's context */
var setQueryClientContext = (client) => {
	setContext(_contextKey, client);
};
var _isRestoringContextKey = Symbol("isRestoring");
/** Retrieves a `isRestoring` from Svelte's context */
var getIsRestoringContext = () => {
	try {
		return getContext(_isRestoringContextKey) ?? { current: false };
	} catch (error) {
		return { current: false };
	}
};
/** Sets a `isRestoring` on Svelte's context */
var setIsRestoringContext = (isRestoring) => {
	setContext(_isRestoringContextKey, isRestoring);
};
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/useIsRestoring.js
function useIsRestoring() {
	return getIsRestoringContext();
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/useQueryClient.js
function useQueryClient(queryClient) {
	if (queryClient) return queryClient;
	return getQueryClientContext();
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/containers.svelte.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ReactiveValue_fn, _ReactiveValue_subscribe;
var ReactiveValue = class {
	constructor(fn, onSubscribe) {
		_ReactiveValue_fn.set(this, void 0);
		_ReactiveValue_subscribe.set(this, void 0);
		__classPrivateFieldSet(this, _ReactiveValue_fn, fn, "f");
		__classPrivateFieldSet(this, _ReactiveValue_subscribe, createSubscriber((update) => onSubscribe(update)), "f");
	}
	get current() {
		__classPrivateFieldGet(this, _ReactiveValue_subscribe, "f").call(this);
		return __classPrivateFieldGet(this, _ReactiveValue_fn, "f").call(this);
	}
};
_ReactiveValue_fn = /* @__PURE__ */ new WeakMap(), _ReactiveValue_subscribe = /* @__PURE__ */ new WeakMap();
/**
* Makes all of the top-level keys of an object into $state.raw fields whose initial values
* are the same as in the original object. Does not mutate the original object. Provides an `update`
* function that _can_ (but does not have to be) be used to replace all of the object's top-level keys
* with the values of the new object, while maintaining the original root object's reference.
*/
function createRawRef(init) {
	const refObj = Array.isArray(init) ? [] : {};
	const hiddenKeys = new SvelteSet();
	const out = new Proxy(refObj, {
		set(target, prop, value, receiver) {
			hiddenKeys.delete(prop);
			if (prop in target) return Reflect.set(target, prop, value, receiver);
			let state = value;
			Object.defineProperty(target, prop, {
				configurable: true,
				enumerable: true,
				get: () => {
					return state && isBranded(state) ? state() : state;
				},
				set: (v) => {
					state = v;
				}
			});
			return true;
		},
		has: (target, prop) => {
			if (hiddenKeys.has(prop)) return false;
			return prop in target;
		},
		ownKeys(target) {
			return Reflect.ownKeys(target).filter((key) => !hiddenKeys.has(key));
		},
		getOwnPropertyDescriptor(target, prop) {
			if (hiddenKeys.has(prop)) return;
			return Reflect.getOwnPropertyDescriptor(target, prop);
		},
		deleteProperty(target, prop) {
			if (prop in target) {
				target[prop] = void 0;
				hiddenKeys.add(prop);
				if (Array.isArray(target)) target.length--;
				return true;
			}
			return false;
		}
	});
	function update(newValue) {
		const existingKeys = Object.keys(out);
		const newKeys = Object.keys(newValue);
		const keysToRemove = existingKeys.filter((key) => !newKeys.includes(key));
		for (const key of keysToRemove) delete out[key];
		for (const key of newKeys) out[key] = brand(() => newValue[key]);
	}
	update(init);
	return [out, update];
}
var lazyBrand = Symbol("LazyValue");
function brand(fn) {
	fn[lazyBrand] = true;
	return fn;
}
function isBranded(fn) {
	return Boolean(fn[lazyBrand]);
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/createBaseQuery.svelte.js
function createBaseQuery(options, Observer, queryClient) {
	/** Load query client */
	const client = derived(() => useQueryClient(queryClient?.()));
	const isRestoring = useIsRestoring();
	const resolvedOptions = derived(() => {
		const opts = client().defaultQueryOptions(options());
		opts._optimisticResults = isRestoring.current ? "isRestoring" : "optimistic";
		return opts;
	});
	/** Creates the observer */
	let observer = new Observer(client(), resolvedOptions());
	function createResult() {
		const result = observer.getOptimisticResult(resolvedOptions());
		return !resolvedOptions().notifyOnChangeProps ? observer.trackResult(result) : result;
	}
	const [query, update] = createRawRef(createResult());
	return query;
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/createQuery.js
function createQuery(options, queryClient) {
	return createBaseQuery(options, QueryObserver, queryClient);
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/queryOptions.js
function queryOptions(options) {
	return options;
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/createQueries.svelte.js
function createQueries(createQueriesOptions, queryClient) {
	const client = derived(() => useQueryClient(queryClient?.()));
	const isRestoring = useIsRestoring();
	const $$d = derived(createQueriesOptions), queries = derived(() => $$d().queries), combine = derived(() => $$d().combine);
	const resolvedQueryOptions = derived(() => queries().map((opts) => {
		const resolvedOptions = client().defaultQueryOptions(opts);
		resolvedOptions._optimisticResults = isRestoring.current ? "isRestoring" : "optimistic";
		return resolvedOptions;
	}));
	const observer = derived(() => new QueriesObserver(client(), resolvedQueryOptions(), combine()));
	function createResult() {
		const [_, getCombinedResult, trackResult] = observer().getOptimisticResult(resolvedQueryOptions(), combine());
		return getCombinedResult(trackResult());
	}
	const [results, update] = createRawRef(createResult());
	return results;
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/createInfiniteQuery.js
function createInfiniteQuery(options, queryClient) {
	return createBaseQuery(options, InfiniteQueryObserver, queryClient);
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/infiniteQueryOptions.js
function infiniteQueryOptions(options) {
	return options;
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/mutationOptions.js
function mutationOptions(options) {
	return options;
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/createMutation.svelte.js
function createMutation(options, queryClient) {
	let observer = new MutationObserver(derived(() => useQueryClient(queryClient?.()))(), options());
	const mutate = (variables, mutateOptions) => {
		observer.mutate(variables, mutateOptions).catch(noop);
	};
	let result = observer.getCurrentResult();
	return derived(() => new Proxy(result, { get: (_, prop) => {
		const r = {
			...result,
			mutate,
			mutateAsync: result.mutate
		};
		if (prop == "value") return r;
		return r[prop];
	} }))();
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/useMutationState.svelte.js
function getResult(mutationCache, options) {
	return mutationCache.findAll(options.filters).map((mutation) => options.select ? options.select(mutation) : mutation.state);
}
function useMutationState(options = {}, queryClient) {
	return getResult(useQueryClient(queryClient).getMutationCache(), options);
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/useIsFetching.svelte.js
function useIsFetching(filters, queryClient) {
	const client = useQueryClient(queryClient);
	const queryCache = client.getQueryCache();
	return new ReactiveValue(() => client.isFetching(filters), (update) => queryCache.subscribe(update));
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/useIsMutating.svelte.js
function useIsMutating(filters, queryClient) {
	const client = useQueryClient(queryClient);
	const cache = client.getMutationCache();
	return new ReactiveValue(() => client.isMutating(filters), (update) => cache.subscribe(update));
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/useHydrate.js
function useHydrate(state, options, queryClient) {
	const client = useQueryClient(queryClient);
	if (state) hydrate(client, state, options);
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/HydrationBoundary.svelte
function HydrationBoundary($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { children, state, options = void 0, queryClient = void 0 } = $$props;
		useHydrate(state, options, queryClient);
		children($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/QueryClientProvider.svelte
function QueryClientProvider($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { client = new QueryClient(), children } = $$props;
		setQueryClientContext(client);
		onDestroy(() => {
			client.unmount();
		});
		children($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/@tanstack/svelte-query/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({
	HydrationBoundary: () => HydrationBoundary,
	QueryClientProvider: () => QueryClientProvider,
	createInfiniteQuery: () => createInfiniteQuery,
	createMutation: () => createMutation,
	createQueries: () => createQueries,
	createQuery: () => createQuery,
	getIsRestoringContext: () => getIsRestoringContext,
	getQueryClientContext: () => getQueryClientContext,
	infiniteQueryOptions: () => infiniteQueryOptions,
	mutationOptions: () => mutationOptions,
	queryOptions: () => queryOptions,
	setIsRestoringContext: () => setIsRestoringContext,
	setQueryClientContext: () => setQueryClientContext,
	useHydrate: () => useHydrate,
	useIsFetching: () => useIsFetching,
	useIsMutating: () => useIsMutating,
	useIsRestoring: () => useIsRestoring,
	useMutationState: () => useMutationState,
	useQueryClient: () => useQueryClient
});
import * as import__tanstack_query_core from "@tanstack/query-core";
__reExport(dist_exports, import__tanstack_query_core);
var infiniteScroll = class InfiniteScroll {
	static instance;
	#queryClient = new dist_exports.QueryClient({ defaultOptions: { queries: { enabled: false } } });
	static getInstance() {
		if (!InfiniteScroll.instance) InfiniteScroll.instance = new InfiniteScroll();
		return InfiniteScroll.instance;
	}
	static async fetchList(endpoint, offset = 0, search = "", params) {
		const url = new URL(endpoint);
		url.searchParams.set("search", search);
		url.searchParams.set("offset", offset.toString());
		if (params) Object.keys(params).forEach((key) => url.searchParams.set(key, params[key]));
		return {
			...await (await fetch(url)).json(),
			lastIndex: offset * 12
		};
	}
	async queryEndpoint(offset = 1, host = "", field = "", search = "") {
		const endpoint = `${host}/api/${field}`;
		return await InfiniteScroll.fetchList(endpoint, offset, search);
	}
	listQuery(searchTerm, host = "", field = "") {
		const self = this;
		return createInfiniteQuery(() => ({
			queryKey: [field, searchTerm],
			staleTime: 3e4,
			initialPageParam: 1,
			retry: false,
			queryFn: async ({ pageParam }) => {
				let offset = (pageParam - 1) * 12;
				const { data, meta, total } = await self.queryEndpoint(offset, host, field, searchTerm);
				return meta ? {
					results: data,
					hasMore: meta.more,
					pageParam,
					total
				} : {
					results: [],
					hasMore: false,
					pageParam,
					total
				};
			},
			getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.pageParam + 1 : void 0,
			select: (data) => {
				let total = 0;
				return {
					results: data.pages.map((page) => {
						total = page.total;
						return page.results;
					}).flat(),
					total
				};
			}
		}));
	}
	get queryClient() {
		return this.#queryClient;
	}
}.getInstance();
//#endregion
//#region src/lib/authentication/fxn.ts
var roles = [
	{
		value: Role.ADMIN,
		label: "Admin",
		color: "destructive"
	},
	{
		value: Role.EDITOR,
		label: "Editor",
		color: "default"
	},
	{
		value: Role.CREATOR,
		label: "Creator",
		color: "outline"
	},
	{
		value: Role.USER,
		label: "User",
		color: "secondary"
	}
];
var getRoleBadgeVariant = (role) => {
	return roles.find((r) => r.value.toLowerCase() === role.toLowerCase())?.color || "secondary";
};
//#endregion
export { QueryClientProvider as a, dist_exports as i, roles as n, useQueryClient as o, infiniteScroll as r, getRoleBadgeVariant as t };
