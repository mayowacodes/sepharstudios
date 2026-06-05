import { ag as user, w as db } from './drizzle-CKUH7ukq.js';
import { F as Fields, e as emptyMetalist } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { or, ilike, eq, and, count, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/lib/db/user.ts
var getUsersBySearchFilter = async (params) => {
	try {
		const { search: searchTerm = "", offset: offsetStr = "0", role, banned } = params;
		const offset = parseInt(offsetStr, 10) || 0;
		const cleanSearchTerm = searchTerm?.trim() || "";
		const conditions = [];
		if (cleanSearchTerm.length > 0) conditions.push(or(ilike(user.name, `%${cleanSearchTerm}%`), ilike(user.email, `%${cleanSearchTerm}%`), ilike(user.role, `%${cleanSearchTerm}%`)));
		if (role) conditions.push(eq(user.role, role));
		if (banned) conditions.push(eq(user.banned, banned.toLowerCase() === "true"));
		const whereCondition = conditions.length > 0 ? and(...conditions) : void 0;
		const total = (await db.select({ count: count() }).from(user).where(whereCondition))[0].count;
		const users = await db.select().from(user).where(whereCondition).orderBy(desc(user.createdAt)).limit(12).offset(offset);
		const hasNextPage = offset + 12 < total;
		return {
			status: "success",
			data: {
				total,
				meta: {
					cursor: users.length > 0 ? users[users.length - 1].id : "",
					more: hasNextPage,
					size: users.length
				},
				data: users
			}
		};
	} catch (error) {
		console.log("getUsersBySearchFilter()", error.message);
		return {
			status: "error",
			message: error.message,
			data: emptyMetalist
		};
	}
};
//#endregion
//#region src/lib/server/index.ts
var fetchSearchFilterList = async (params, list) => {
	switch (list) {
		case Fields.USER: return (await getUsersBySearchFilter(params)).data;
	}
};
var getSearchFilterList = async (locals, url, field) => {
	if (!locals.user) return new Response("Unauthorized", { status: 401 });
	const params = {};
	url.searchParams.forEach((value, key) => {
		params[key] = value;
	});
	return json(await fetchSearchFilterList(params, field));
};
//#endregion
//#region src/routes/api/users/+server.ts
var GET = async ({ locals, url }) => {
	return await getSearchFilterList(locals, url, Fields.USER);
};

export { GET };
//# sourceMappingURL=_server.ts-JKffUmxb.js.map
