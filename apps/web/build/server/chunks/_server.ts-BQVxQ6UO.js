import { j as json } from './index-BcOZ6EV9.js';
import { F as Fields, M as MAX_ITEMS_PER_PAGE, e as emptyMetalist } from './index-DDpoV-rm.js';
import { c as user, d as db } from './drizzle-CW7hPjGG.js';
import { or, ilike, eq, and, count, desc } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import './ui-libs-Yf6h8PPk.js';
import './Icon-DVHDtCfs.js';
import './layout-dashboard-xPr2miEu.js';
import './users-B4M3or-k.js';
import './user-CxFDLytf.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const getUsersBySearchFilter = async (params) => {
  try {
    const { search: searchTerm = "", offset: offsetStr = "0", role, banned } = params;
    const offset = parseInt(offsetStr, 10) || 0;
    const cleanSearchTerm = searchTerm?.trim() || "";
    const conditions = [];
    if (cleanSearchTerm.length > 0) {
      conditions.push(or(
        ilike(user.name, `%${cleanSearchTerm}%`),
        ilike(user.email, `%${cleanSearchTerm}%`),
        ilike(user.role, `%${cleanSearchTerm}%`)
      ));
    }
    if (role) conditions.push(eq(user.role, role));
    if (banned) conditions.push(eq(user.banned, banned.toLowerCase() === "true"));
    const whereCondition = conditions.length > 0 ? and(...conditions) : void 0;
    const totalResult = await db.select({ count: count() }).from(user).where(whereCondition);
    const total = totalResult[0].count;
    const users = await db.select().from(user).where(whereCondition).orderBy(desc(user.createdAt)).limit(MAX_ITEMS_PER_PAGE).offset(offset);
    const hasNextPage = offset + MAX_ITEMS_PER_PAGE < total;
    const usersMeta = {
      total,
      meta: { cursor: users.length > 0 ? users[users.length - 1].id : "", more: hasNextPage, size: users.length },
      data: users
    };
    return { status: "success", data: usersMeta };
  } catch (error) {
    console.log("getUsersBySearchFilter()", error.message);
    return { status: "error", message: error.message, data: emptyMetalist };
  }
};
const fetchSearchFilterList = async (params, list) => {
  switch (list) {
    case Fields.USER:
      const usersResult = await getUsersBySearchFilter(params);
      return usersResult.data;
  }
};
const getSearchFilterList = async (locals, url, field) => {
  if (!locals.user) return new Response("Unauthorized", { status: 401 });
  const params = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  const list = await fetchSearchFilterList(params, field);
  return json(list);
};
const GET = async ({ locals, url }) => {
  return await getSearchFilterList(locals, url, Fields.USER);
};

export { GET };
//# sourceMappingURL=_server.ts-BQVxQ6UO.js.map
