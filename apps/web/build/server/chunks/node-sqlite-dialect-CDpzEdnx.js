import { C as CompiledQuery, D as DefaultQueryCompiler, s as sql } from './auth-BIGF7JWL.js';
import { D as DEFAULT_MIGRATION_TABLE, a as DEFAULT_MIGRATION_LOCK_TABLE } from './kysely-migration-tables-JkVUjPF_-npFuJvGd.js';
import './index.js-DwRgOKlO.js';
import './drizzle-DlGuU73K.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './constants-RccSloty.js';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';
import './server2-K9pj3rZ3.js';
import './string-BwaV7M5i.js';
import './analytics-BQfMKWJO.js';
import '@openpanel/sdk';
import './stc-hours-o6kTWolX.js';
import 'node:crypto';
import 'zod';
import 'node:fs';
import 'node:fs/promises';
import 'node:os';
import 'node:path';

//#region ../../node_modules/.bun/@better-auth+kysely-adapter@1.6.23+2eafd0ad69bdea18/node_modules/@better-auth/kysely-adapter/dist/node-sqlite-dialect.mjs
var NodeSqliteAdapter = class {
	get supportsCreateIfNotExists() {
		return true;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsMultipleConnections() {
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
		const stmt = this.#db.prepare(sql);
		const params = parameters;
		if (stmt.columns().length > 0) return Promise.resolve({ rows: stmt.all(...params) });
		const { changes, lastInsertRowid } = stmt.run(...params);
		return Promise.resolve({
			rows: [],
			numAffectedRows: BigInt(changes),
			insertId: typeof lastInsertRowid === "bigint" ? lastInsertRowid : BigInt(lastInsertRowid)
		});
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
			isView: false,
			isForeign: false
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
//# sourceMappingURL=node-sqlite-dialect-CDpzEdnx.js.map
