import { db } from "./drizzle";
import { user } from "./schema";
import { eq, desc, or, ilike, count, and } from "drizzle-orm";
import type { iFetchMeta } from "$lib/interface";
import { emptyMetalist, MAX_ITEMS_PER_PAGE } from "$lib/constants";

export const getUser = async (userId: string) => {
  try {
    const result = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error: any) {
    console.log("getUser()", error.message);
    return null;
  }
};

export const getUsersBySearchFilter = async (params: Record<string, string>) => {
  try {
    const { search: searchTerm = "", offset: offsetStr = "0", role, banned } = params;
    const offset = parseInt(offsetStr, 10) || 0;
    const cleanSearchTerm = searchTerm?.trim() || "";

    const conditions: any[] = [];
    if (cleanSearchTerm.length > 0) {
      conditions.push(or(
        ilike(user.name, `%${cleanSearchTerm}%`),
        ilike(user.email, `%${cleanSearchTerm}%`),
        ilike(user.role, `%${cleanSearchTerm}%`)
      ));
    }
    if (role) conditions.push(eq(user.role, role));
    if (banned) conditions.push(eq(user.banned, banned.toLowerCase() === 'true'));

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    const totalResult = await db.select({ count: count() }).from(user).where(whereCondition);
    const total = totalResult[0].count;

    const users = await db.select().from(user).where(whereCondition)
      .orderBy(desc(user.createdAt)).limit(MAX_ITEMS_PER_PAGE).offset(offset);

    const hasNextPage = offset + MAX_ITEMS_PER_PAGE < total;

    const usersMeta: iFetchMeta = {
      total,
      meta: { cursor: users.length > 0 ? users[users.length - 1].id : '', more: hasNextPage, size: users.length },
      data: users
    };

    return { status: "success", data: usersMeta };
  } catch (error: any) {
    console.log("getUsersBySearchFilter()", error.message);
    return { status: "error", message: error.message, data: emptyMetalist };
  }
};
