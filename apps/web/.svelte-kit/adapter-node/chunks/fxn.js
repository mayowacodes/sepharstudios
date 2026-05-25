import "clsx";
import { a6 as BROWSER, J as setContext, x as getContext, a7 as readable, y as derived, a8 as get } from "./ui-libs.js";
import { M as MAX_ITEMS_PER_PAGE, R as Role } from "./index.js";
import { noop, notifyManager, InfiniteQueryObserver, QueryClient } from "@tanstack/query-core";
const browser = BROWSER;
const _contextKey = "$$_queryClient";
const getQueryClientContext = () => {
  const client = getContext(_contextKey);
  if (!client) {
    throw new Error("No QueryClient was found in Svelte context. Did you forget to wrap your component with QueryClientProvider?");
  }
  return client;
};
const setQueryClientContext = (client) => {
  setContext(_contextKey, client);
};
const _isRestoringContextKey = "$$_isRestoring";
const getIsRestoringContext = () => {
  try {
    const isRestoring = getContext(_isRestoringContextKey);
    return isRestoring ? isRestoring : readable(false);
  } catch (error) {
    return readable(false);
  }
};
function useIsRestoring() {
  return getIsRestoringContext();
}
function useQueryClient(queryClient) {
  if (queryClient)
    return queryClient;
  return getQueryClientContext();
}
function isSvelteStore(obj) {
  return "subscribe" in obj && typeof obj.subscribe === "function";
}
function createBaseQuery(options, Observer, queryClient) {
  const client = useQueryClient(queryClient);
  const isRestoring = useIsRestoring();
  const optionsStore = isSvelteStore(options) ? options : readable(options);
  const defaultedOptionsStore = derived([optionsStore, isRestoring], ([$optionsStore, $isRestoring]) => {
    const defaultedOptions = client.defaultQueryOptions($optionsStore);
    defaultedOptions._optimisticResults = $isRestoring ? "isRestoring" : "optimistic";
    return defaultedOptions;
  });
  const observer = new Observer(client, get(defaultedOptionsStore));
  defaultedOptionsStore.subscribe(($defaultedOptions) => {
    observer.setOptions($defaultedOptions);
  });
  const result = derived(isRestoring, ($isRestoring, set) => {
    const unsubscribe = $isRestoring ? noop : observer.subscribe(notifyManager.batchCalls(set));
    observer.updateResult();
    return unsubscribe;
  });
  const { subscribe } = derived([result, defaultedOptionsStore], ([$result, $defaultedOptionsStore]) => {
    $result = observer.getOptimisticResult($defaultedOptionsStore);
    return !$defaultedOptionsStore.notifyOnChangeProps ? observer.trackResult($result) : $result;
  });
  return { subscribe };
}
function createInfiniteQuery(options, queryClient) {
  return createBaseQuery(options, InfiniteQueryObserver, queryClient);
}
class InfiniteScroll {
  static instance;
  #queryClient = new QueryClient({ defaultOptions: { queries: { enabled: browser } } });
  static getInstance() {
    if (!InfiniteScroll.instance) InfiniteScroll.instance = new InfiniteScroll();
    return InfiniteScroll.instance;
  }
  static async fetchList(endpoint, offset = 0, search = "", params) {
    const url = new URL(endpoint);
    url.searchParams.set("search", search);
    url.searchParams.set("offset", offset.toString());
    if (params) Object.keys(params).forEach((key) => url.searchParams.set(key, params[key]));
    const response = await fetch(url);
    let partial = await response.json();
    return { ...partial, lastIndex: offset * MAX_ITEMS_PER_PAGE };
  }
  async queryEndpoint(offset = 1, host = "", field = "", search = "") {
    const endpoint = `${host}/api/${field}`;
    return await InfiniteScroll.fetchList(endpoint, offset, search);
  }
  listQuery(searchTerm, host = "", field = "") {
    const self = this;
    return createInfiniteQuery({
      queryKey: [field, searchTerm],
      staleTime: 3e4,
      initialPageParam: 1,
      retry: false,
      queryFn: async ({ pageParam }) => {
        let offset = (pageParam - 1) * MAX_ITEMS_PER_PAGE;
        const metalist = await self.queryEndpoint(offset, host, field, searchTerm);
        const { data, meta, total } = metalist;
        return meta ? { results: data, hasMore: meta.more, pageParam, total } : { results: [], hasMore: false, pageParam, total };
      },
      getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.pageParam + 1 : void 0,
      select: (data) => {
        let total = 0;
        const results = data.pages.map((page) => {
          total = page.total;
          return page.results;
        }).flat();
        return { results, total };
      }
    });
  }
  get queryClient() {
    return this.#queryClient;
  }
}
const infiniteScroll = InfiniteScroll.getInstance();
const roles = [
  { value: Role.ADMIN, label: "Admin", color: "destructive" },
  { value: Role.EDITOR, label: "Editor", color: "default" },
  { value: Role.CREATOR, label: "Creator", color: "outline" },
  { value: Role.USER, label: "User", color: "secondary" }
];
const getRoleBadgeVariant = (role) => {
  const roleConfig = roles.find((r) => r.value.toLowerCase() === role.toLowerCase());
  return roleConfig?.color || "secondary";
};
export {
  getRoleBadgeVariant as g,
  infiniteScroll as i,
  roles as r,
  setQueryClientContext as s,
  useQueryClient as u
};
