import { adminRoles, Fields, Role } from "$lib/constants";
import type { iFetchMeta } from "$lib/interface";
import { getUsersBySearchFilter } from "$lib/db/user";
import { json } from "@sveltejs/kit";

export const fetchSearchFilterList = async (params: Record<string, string>, list: Fields) => {
  switch (list) {
    case Fields.USER:
      const usersResult = await getUsersBySearchFilter(params);
      return usersResult.data as iFetchMeta;
  }
};

export const authGuard = async (locals: App.Locals, authorizedPersonels?: Role[]) => {
  const user = locals.user;
  if (!user) return { authorized: false, message: 'Unauthenticated' };
  const personnels = authorizedPersonels ? authorizedPersonels : adminRoles;
  if (!personnels.includes(user.role as Role)) return { authorized: false, message: 'Unauthorized' };
  return { authorized: true, message: 'passes check' };
};

export const getSearchFilterList = async (locals: App.Locals, url: URL, field: Fields) => {
  if (!locals.user) return new Response('Unauthorized', { status: 401 });
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => { params[key] = value; });
  const list = await fetchSearchFilterList(params, field);
  return json(list);
};
