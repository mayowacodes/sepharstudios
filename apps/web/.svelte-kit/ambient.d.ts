
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const NODE_ENV: string;
	export const HOST: string;
	export const PORT: string;
	export const ORIGIN: string;
	export const DATABASE_URL: string;
	export const BETTER_AUTH_SECRET: string;
	export const BETTER_AUTH_URL: string;
	export const BETTER_API_URL: string;
	export const GOOGLE_CLIENT_ID: string;
	export const GOOGLE_CLIENT_SECRET: string;
	export const REDIRECT_URI: string;
	export const INIO_ROOT_USER: string;
	export const MINIO_ROOT_PASSWORD: string;
	export const MINIO_BROWSER_REDIRECT_URL: string;
	export const MINIO_BROWSER_REDIRECT: string;
	export const MINIO_ROOT_USER: string;
	export const MINIO_ENDPOINT: string;
	export const MINIO_PORT: string;
	export const MINIO_USE_SSL: string;
	export const MINIO_ACCESS_KEY: string;
	export const MINIO_SECRET_KEY: string;
	export const MINIO_BUCKET: string;
	export const SERVER_URL: string;
	export const AUTHENTICATION_TYPE: string;
	export const AUTHENTICATION_API_KEY: string;
	export const AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES: string;
	export const LANGUAGE: string;
	export const CONFIG_SESSION_PHONE_CLIENT: string;
	export const CONFIG_SESSION_PHONE_NAME: string;
	export const TELEMETRY: string;
	export const TELEMETRY_URL: string;
	export const POSTGRES_DATABASE: string;
	export const POSTGRES_USERNAME: string;
	export const POSTGRES_PASSWORD: string;
	export const DATABASE_ENABLED: string;
	export const DATABASE_PROVIDER: string;
	export const DATABASE_CONNECTION_URI: string;
	export const DATABASE_SAVE_DATA_INSTANCE: string;
	export const DATABASE_SAVE_DATA_NEW_MESSAGE: string;
	export const DATABASE_SAVE_MESSAGE_UPDATE: string;
	export const DATABASE_SAVE_DATA_CONTACTS: string;
	export const DATABASE_SAVE_DATA_CHATS: string;
	export const DATABASE_SAVE_DATA_LABELS: string;
	export const DATABASE_SAVE_DATA_HISTORIC: string;
	export const CACHE_REDIS_ENABLED: string;
	export const CACHE_REDIS_URI: string;
	export const CACHE_REDIS_PREFIX_KEY: string;
	export const CACHE_REDIS_SAVE_INSTANCES: string;
	export const EMAIL_WEBHOOK: string;
	export const ALLUSERSPROFILE: string;
	export const ANTIGRAVITY_CLI_ALIAS: string;
	export const APPDATA: string;
	export const BUNDLED_DEBUGPY_PATH: string;
	export const ChocolateyInstall: string;
	export const ChocolateyLastPathUpdate: string;
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const COLORTERM: string;
	export const CommonProgramFiles: string;
	export const CommonProgramW6432: string;
	export const COMPUTERNAME: string;
	export const ComSpec: string;
	export const DriverData: string;
	export const FPS_BROWSER_APP_PROFILE_STRING: string;
	export const FPS_BROWSER_USER_PROFILE_STRING: string;
	export const GIT_ASKPASS: string;
	export const GK_GL_ADDR: string;
	export const GK_GL_PATH: string;
	export const HOMEDRIVE: string;
	export const HOMEPATH: string;
	export const LANG: string;
	export const LOCALAPPDATA: string;
	export const LOGONSERVER: string;
	export const NODE: string;
	export const npm_command: string;
	export const npm_config_local_prefix: string;
	export const npm_config_user_agent: string;
	export const npm_execpath: string;
	export const npm_lifecycle_event: string;
	export const npm_lifecycle_script: string;
	export const npm_node_execpath: string;
	export const npm_package_json: string;
	export const npm_package_name: string;
	export const npm_package_version: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const OS: string;
	export const Path: string;
	export const PATHEXT: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const ProgramData: string;
	export const ProgramFiles: string;
	export const ProgramW6432: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const PWD: string;
	export const PYDEVD_DISABLE_FILE_VALIDATION: string;
	export const PYTHONSTARTUP: string;
	export const PYTHON_BASIC_REPL: string;
	export const SESSIONNAME: string;
	export const SystemDrive: string;
	export const SystemRoot: string;
	export const TEMP: string;
	export const TERM_PROGRAM: string;
	export const TERM_PROGRAM_VERSION: string;
	export const TMP: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const VITE_USER_NODE_ENV: string;
	export const VSCODE_DEBUGPY_ADAPTER_ENDPOINTS: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const VSCODE_INJECTION: string;
	export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
	export const windir: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_BETTER_AUTH_URL: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		NODE_ENV: string;
		HOST: string;
		PORT: string;
		ORIGIN: string;
		DATABASE_URL: string;
		BETTER_AUTH_SECRET: string;
		BETTER_AUTH_URL: string;
		BETTER_API_URL: string;
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		REDIRECT_URI: string;
		INIO_ROOT_USER: string;
		MINIO_ROOT_PASSWORD: string;
		MINIO_BROWSER_REDIRECT_URL: string;
		MINIO_BROWSER_REDIRECT: string;
		MINIO_ROOT_USER: string;
		MINIO_ENDPOINT: string;
		MINIO_PORT: string;
		MINIO_USE_SSL: string;
		MINIO_ACCESS_KEY: string;
		MINIO_SECRET_KEY: string;
		MINIO_BUCKET: string;
		SERVER_URL: string;
		AUTHENTICATION_TYPE: string;
		AUTHENTICATION_API_KEY: string;
		AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES: string;
		LANGUAGE: string;
		CONFIG_SESSION_PHONE_CLIENT: string;
		CONFIG_SESSION_PHONE_NAME: string;
		TELEMETRY: string;
		TELEMETRY_URL: string;
		POSTGRES_DATABASE: string;
		POSTGRES_USERNAME: string;
		POSTGRES_PASSWORD: string;
		DATABASE_ENABLED: string;
		DATABASE_PROVIDER: string;
		DATABASE_CONNECTION_URI: string;
		DATABASE_SAVE_DATA_INSTANCE: string;
		DATABASE_SAVE_DATA_NEW_MESSAGE: string;
		DATABASE_SAVE_MESSAGE_UPDATE: string;
		DATABASE_SAVE_DATA_CONTACTS: string;
		DATABASE_SAVE_DATA_CHATS: string;
		DATABASE_SAVE_DATA_LABELS: string;
		DATABASE_SAVE_DATA_HISTORIC: string;
		CACHE_REDIS_ENABLED: string;
		CACHE_REDIS_URI: string;
		CACHE_REDIS_PREFIX_KEY: string;
		CACHE_REDIS_SAVE_INSTANCES: string;
		EMAIL_WEBHOOK: string;
		ALLUSERSPROFILE: string;
		ANTIGRAVITY_CLI_ALIAS: string;
		APPDATA: string;
		BUNDLED_DEBUGPY_PATH: string;
		ChocolateyInstall: string;
		ChocolateyLastPathUpdate: string;
		CHROME_CRASHPAD_PIPE_NAME: string;
		COLORTERM: string;
		CommonProgramFiles: string;
		CommonProgramW6432: string;
		COMPUTERNAME: string;
		ComSpec: string;
		DriverData: string;
		FPS_BROWSER_APP_PROFILE_STRING: string;
		FPS_BROWSER_USER_PROFILE_STRING: string;
		GIT_ASKPASS: string;
		GK_GL_ADDR: string;
		GK_GL_PATH: string;
		HOMEDRIVE: string;
		HOMEPATH: string;
		LANG: string;
		LOCALAPPDATA: string;
		LOGONSERVER: string;
		NODE: string;
		npm_command: string;
		npm_config_local_prefix: string;
		npm_config_user_agent: string;
		npm_execpath: string;
		npm_lifecycle_event: string;
		npm_lifecycle_script: string;
		npm_node_execpath: string;
		npm_package_json: string;
		npm_package_name: string;
		npm_package_version: string;
		NUMBER_OF_PROCESSORS: string;
		OS: string;
		Path: string;
		PATHEXT: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		ProgramData: string;
		ProgramFiles: string;
		ProgramW6432: string;
		PSModulePath: string;
		PUBLIC: string;
		PWD: string;
		PYDEVD_DISABLE_FILE_VALIDATION: string;
		PYTHONSTARTUP: string;
		PYTHON_BASIC_REPL: string;
		SESSIONNAME: string;
		SystemDrive: string;
		SystemRoot: string;
		TEMP: string;
		TERM_PROGRAM: string;
		TERM_PROGRAM_VERSION: string;
		TMP: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		USERNAME: string;
		USERPROFILE: string;
		VITE_USER_NODE_ENV: string;
		VSCODE_DEBUGPY_ADAPTER_ENDPOINTS: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		VSCODE_GIT_IPC_HANDLE: string;
		VSCODE_INJECTION: string;
		VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
		windir: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_BETTER_AUTH_URL: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
