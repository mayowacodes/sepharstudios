import { browser } from '$app/environment';
import { MAX_ITEMS_PER_PAGE } from '$lib/constants';
import type { iFetchMeta } from '$lib/interface';
import { createInfiniteQuery, QueryClient, type CreateInfiniteQueryResult, type InfiniteData } from '@tanstack/svelte-query';

export class InfiniteScroll {
  private static instance: InfiniteScroll;
  #queryClient: QueryClient = new QueryClient({ defaultOptions: { queries: { enabled: browser } } });

  public static getInstance(): InfiniteScroll {
    if (!InfiniteScroll.instance) InfiniteScroll.instance = new InfiniteScroll();
    return InfiniteScroll.instance;
  }

  static async fetchList(endpoint: string, offset: number = 0, search: string = '', params?: Record<string, string>) {
    const url = new URL(endpoint);
    url.searchParams.set("search", search);
    url.searchParams.set("offset", offset.toString());
    if (params) Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));
    const response = await fetch(url);
    let partial = await response.json() as iFetchMeta;
    return { ...partial, lastIndex: offset * MAX_ITEMS_PER_PAGE } as iFetchMeta;
  }

  async queryEndpoint(offset: number = 1, host: string = '', field: string = '', search: string = '') {
    const endpoint = `${host}/api/${field}`;
    return await InfiniteScroll.fetchList(endpoint, offset, search);
  }

  listQuery<T>(searchTerm: string, host: string = '', field: string = '') {
    const self = this;
    return createInfiniteQuery({
      queryKey: [field, searchTerm],
      staleTime: 30000,
      initialPageParam: 1,
      retry: false,
      queryFn: async ({ pageParam }) => {
        let offset = (pageParam - 1) * MAX_ITEMS_PER_PAGE;
        const metalist = await self.queryEndpoint(offset, host, field, searchTerm);
        const { data, meta, total } = metalist;
        return meta ? { results: data as T[], hasMore: meta.more, pageParam, total } : { results: [], hasMore: false, pageParam, total };
      },
      getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.pageParam + 1 : undefined,
      select: (data) => {
        let total = 0;
        const results = data.pages.map((page) => { total = page.total; return page.results; }).flat();
        return { results, total };
      }
    });
  }

  get queryClient() { return this.#queryClient; }
}

export const infiniteScroll = InfiniteScroll.getInstance();
