import { C as CompiledQuery, b as DefaultQueryCompiler, a as DEFAULT_MIGRATION_TABLE, D as DEFAULT_MIGRATION_LOCK_TABLE, s as sql } from './auth-B1iRtYym.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import './drizzle-CKUH7ukq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './constants-BEpeHz1K.js';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './server2-D6YOLBns.js';
import './string-DVvRuJqu.js';
import './analytics-C04NmVoh.js';
import '@openpanel/sdk';
import 'zod';
import './hmac-DQSDUlCl.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';
import './sha2-Cn2-4DsP.js';
import 'node:fs';
import 'node:fs/promises';
import 'node:os';
import 'node:path';

//#region src/node-sqlite-dialect.ts
var NodeSqliteAdapter = class {
	get supportsCreateIfNotExists() {
		return true;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock() {}
	async releaseMigrationLock() {}
	get supportsOutput() {
		return true;
	}
};
var NodeSqliteDriver = class {
	#config;
	#connectionMutex = new ConnectionMutex();
	#db;
	#connection;
	constructor(config) {
		this.#config = { ...config };
	}
	async init() {
		this.#db = this.#config.database;
		this.#connection = new NodeSqliteConnection(this.#db);
		if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
	}
	async acquireConnection() {
		await this.#connectionMutex.lock();
		return this.#connection;
	}
	async beginTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async releaseConnection() {
		this.#connectionMutex.unlock();
	}
	async destroy() {
		this.#db?.close();
	}
};
var NodeSqliteConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	executeQuery(compiledQuery) {
		const { sql, parameters } = compiledQuery;
		const rows = this.#db.prepare(sql).all(...parameters);
		return Promise.resolve({ rows });
	}
	async *streamQuery() {
		throw new Error("Streaming query is not supported by SQLite driver.");
	}
};
var ConnectionMutex = class {
	#promise;
	#resolve;
	async lock() {
		while (this.#promise !== void 0) await this.#promise;
		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}
	unlock() {
		const resolve = this.#resolve;
		this.#promise = void 0;
		this.#resolve = void 0;
		resolve?.();
	}
};
var NodeSqliteIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return [];
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		let query = this.#db.selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
		if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
		const tables = await query.execute();
		return Promise.all(tables.map(({ name }) => this.#getTableMetadata(name)));
	}
	async getMetadata(options) {
		return { tables: await this.getTables(options) };
	}
	async #getTableMetadata(table) {
		const db = this.#db;
		const autoIncrementCol = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]?.sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
		return {
			name: table,
			columns: (await db.selectFrom(sql`pragma_table_info(${table})`.as("table_info")).select([
				"name",
				"type",
				"notnull",
				"dflt_value"
			]).execute()).map((col) => ({
				name: col.name,
				dataType: col.type,
				isNullable: !col.notnull,
				isAutoIncrementing: col.name === autoIncrementCol,
				hasDefaultValue: col.dflt_value != null
			})),
			isView: true
		};
	}
};
var NodeSqliteQueryCompiler = class extends DefaultQueryCompiler {
	getCurrentParameterPlaceholder() {
		return "?";
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getAutoIncrement() {
		return "autoincrement";
	}
};
var NodeSqliteDialect = class {
	#config;
	constructor(config) {
		this.#config = { ...config };
	}
	createDriver() {
		return new NodeSqliteDriver(this.#config);
	}
	createQueryCompiler() {
		return new NodeSqliteQueryCompiler();
	}
	createAdapter() {
		return new NodeSqliteAdapter();
	}
	createIntrospector(db) {
		return new NodeSqliteIntrospector(db);
	}
};

export { NodeSqliteDialect };
//# sourceMappingURL=node-sqlite-dialect-RuZyELsy.js.map
