
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const AUTHENTICATION_API_KEY: string;
	export const AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES: string;
	export const AUTHENTICATION_TYPE: string;
	export const BETTER_API_URL: string;
	export const BETTER_AUTH_API_KEY: string;
	export const BETTER_AUTH_SECRET: string;
	export const BETTER_AUTH_URL: string;
	export const BUNNY_CDN_HOST: string;
	export const BUNNY_SECRET_KEY: string;
	export const CACHE_REDIS_ENABLED: string;
	export const CACHE_REDIS_PREFIX_KEY: string;
	export const CACHE_REDIS_SAVE_INSTANCES: string;
	export const CACHE_REDIS_URI: string;
	export const CONFIG_SESSION_PHONE_CLIENT: string;
	export const CONFIG_SESSION_PHONE_NAME: string;
	export const CRON_SECRET: string;
	export const DATABASE_CONNECTION_URI: string;
	export const DATABASE_ENABLED: string;
	export const DATABASE_PROVIDER: string;
	export const DATABASE_SAVE_DATA_CHATS: string;
	export const DATABASE_SAVE_DATA_CONTACTS: string;
	export const DATABASE_SAVE_DATA_HISTORIC: string;
	export const DATABASE_SAVE_DATA_INSTANCE: string;
	export const DATABASE_SAVE_DATA_LABELS: string;
	export const DATABASE_SAVE_DATA_NEW_MESSAGE: string;
	export const DATABASE_SAVE_MESSAGE_UPDATE: string;
	export const DATABASE_URL: string;
	export const EMAIL_WEBHOOK: string;
	export const ENCODER_API_KEY: string;
	export const ENCODER_API_URL: string;
	export const ENCODER_INPUT_BUCKET: string;
	export const ENCODER_MINIO_ACCESS_KEY: string;
	export const ENCODER_MINIO_ENDPOINT: string;
	export const ENCODER_MINIO_PORT: string;
	export const ENCODER_MINIO_SECRET_KEY: string;
	export const ENCODER_MINIO_USE_SSL: string;
	export const GOOGLE_CLIENT_ID: string;
	export const GOOGLE_CLIENT_SECRET: string;
	export const HOST: string;
	export const LANGUAGE: string;
	export const MINIO_ACCESS_KEY: string;
	export const MINIO_BROWSER_REDIRECT: string;
	export const MINIO_BROWSER_REDIRECT_URL: string;
	export const MINIO_BUCKET: string;
	export const MINIO_ENDPOINT: string;
	export const MINIO_PORT: string;
	export const MINIO_ROOT_PASSWORD: string;
	export const MINIO_ROOT_USER: string;
	export const MINIO_SECRET_KEY: string;
	export const MINIO_USE_SSL: string;
	export const ORCHESTRATOR_API_SECRET: string;
	export const ORCHESTRATOR_BASE_URL: string;
	export const ORIGIN: string;
	export const PLATFORM_BASE_URL: string;
	export const PLATFORM_WEBHOOK_SECRET: string;
	export const PORT: string;
	export const POSTGRES_DATABASE: string;
	export const POSTGRES_PASSWORD: string;
	export const POSTGRES_USERNAME: string;
	export const REDIRECT_URI: string;
	export const REDIS_URL: string;
	export const SEPHAR_BACKEND_TOKEN: string;
	export const SERVER_URL: string;
	export const TARGET_LANGUAGES: string;
	export const TELEMETRY: string;
	export const TELEMETRY_URL: string;
	export const VAPID_CONTACT: string;
	export const VAPID_PRIVATE_KEY: string;
	export const ALLUSERSPROFILE: string;
	export const AMOY_RPC_URL: string;
	export const APPDATA: string;
	export const BODY_SIZE_LIMIT: string;
	export const BUN_INSPECT_CONNECT_TO: string;
	export const ChocolateyInstall: string;
	export const ChocolateyLastPathUpdate: string;
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const CLAUDE_CODE_SSE_PORT: string;
	export const COLORTERM: string;
	export const CommonProgramFiles: string;
	export const CommonProgramW6432: string;
	export const COMPUTERNAME: string;
	export const ComSpec: string;
	export const COPILOT_DEBUG_NONCE: string;
	export const DriverData: string;
	export const ENCODER_MINIO_ROOT_PASSWORD: string;
	export const ENCODER_MINIO_ROOT_USER: string;
	export const ENCRYPTION_KEY: string;
	export const FPS_BROWSER_APP_PROFILE_STRING: string;
	export const FPS_BROWSER_USER_PROFILE_STRING: string;
	export const GENERIC_TIMEZONE: string;
	export const GIT_ASKPASS: string;
	export const HOMEDRIVE: string;
	export const HOMEPATH: string;
	export const LANG: string;
	export const LOCALAPPDATA: string;
	export const LOGONSERVER: string;
	export const N8N_HOST: string;
	export const N8N_PORT: string;
	export const N8N_RUNNERS_SECRET: string;
	export const NODE: string;
	export const NODE_ENV: string;
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
	export const OLLAMA_HOST: string;
	export const OS: string;
	export const Path: string;
	export const PATHEXT: string;
	export const POLYGON_RPC_URL: string;
	export const POSTGRES_DB: string;
	export const POSTGRES_USER: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const ProgramData: string;
	export const ProgramFiles: string;
	export const ProgramW6432: string;
	export const PROXY_HOPS: string;
	export const PSExecutionPolicyPreference: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const PWD: string;
	export const PYTHONSTARTUP: string;
	export const PYTHON_BASIC_REPL: string;
	export const SESSIONNAME: string;
	export const SMTP_FROM: string;
	export const SMTP_HOST: string;
	export const SMTP_PASSWORD: string;
	export const SMTP_PORT: string;
	export const SMTP_USER: string;
	export const SystemDrive: string;
	export const SystemRoot: string;
	export const TEMP: string;
	export const TEMPORAL_UI_HTPASSWD: string;
	export const TERM_PROGRAM: string;
	export const TERM_PROGRAM_VERSION: string;
	export const TMP: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const VIRTUAL_ENV: string;
	export const VIRTUAL_ENV_PROMPT: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const VSCODE_INJECTION: string;
	export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
	export const windir: string;
	export const WPSCLI_HOME: string;
	export const _OLD_VIRTUAL_PATH: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	export const PUBLIC_BETTER_AUTH_URL: string;
	export const PUBLIC_CREATOR_PAYMENTS_AMOY: string;
	export const PUBLIC_ENCODER_MINIO_URL: string;
	export const PUBLIC_VAPID_PUBLIC_KEY: string;
	export const PUBLIC_API_URL: string;
	export const PUBLIC_MINIO_URL: string;
	export const PUBLIC_WALLETCONNECT_PROJECT_ID: string;
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		AUTHENTICATION_API_KEY: string;
		AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES: string;
		AUTHENTICATION_TYPE: string;
		BETTER_API_URL: string;
		BETTER_AUTH_API_KEY: string;
		BETTER_AUTH_SECRET: string;
		BETTER_AUTH_URL: string;
		BUNNY_CDN_HOST: string;
		BUNNY_SECRET_KEY: string;
		CACHE_REDIS_ENABLED: string;
		CACHE_REDIS_PREFIX_KEY: string;
		CACHE_REDIS_SAVE_INSTANCES: string;
		CACHE_REDIS_URI: string;
		CONFIG_SESSION_PHONE_CLIENT: string;
		CONFIG_SESSION_PHONE_NAME: string;
		CRON_SECRET: string;
		DATABASE_CONNECTION_URI: string;
		DATABASE_ENABLED: string;
		DATABASE_PROVIDER: string;
		DATABASE_SAVE_DATA_CHATS: string;
		DATABASE_SAVE_DATA_CONTACTS: string;
		DATABASE_SAVE_DATA_HISTORIC: string;
		DATABASE_SAVE_DATA_INSTANCE: string;
		DATABASE_SAVE_DATA_LABELS: string;
		DATABASE_SAVE_DATA_NEW_MESSAGE: string;
		DATABASE_SAVE_MESSAGE_UPDATE: string;
		DATABASE_URL: string;
		EMAIL_WEBHOOK: string;
		ENCODER_API_KEY: string;
		ENCODER_API_URL: string;
		ENCODER_INPUT_BUCKET: string;
		ENCODER_MINIO_ACCESS_KEY: string;
		ENCODER_MINIO_ENDPOINT: string;
		ENCODER_MINIO_PORT: string;
		ENCODER_MINIO_SECRET_KEY: string;
		ENCODER_MINIO_USE_SSL: string;
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		HOST: string;
		LANGUAGE: string;
		MINIO_ACCESS_KEY: string;
		MINIO_BROWSER_REDIRECT: string;
		MINIO_BROWSER_REDIRECT_URL: string;
		MINIO_BUCKET: string;
		MINIO_ENDPOINT: string;
		MINIO_PORT: string;
		MINIO_ROOT_PASSWORD: string;
		MINIO_ROOT_USER: string;
		MINIO_SECRET_KEY: string;
		MINIO_USE_SSL: string;
		ORCHESTRATOR_API_SECRET: string;
		ORCHESTRATOR_BASE_URL: string;
		ORIGIN: string;
		PLATFORM_BASE_URL: string;
		PLATFORM_WEBHOOK_SECRET: string;
		PORT: string;
		POSTGRES_DATABASE: string;
		POSTGRES_PASSWORD: string;
		POSTGRES_USERNAME: string;
		REDIRECT_URI: string;
		REDIS_URL: string;
		SEPHAR_BACKEND_TOKEN: string;
		SERVER_URL: string;
		TARGET_LANGUAGES: string;
		TELEMETRY: string;
		TELEMETRY_URL: string;
		VAPID_CONTACT: string;
		VAPID_PRIVATE_KEY: string;
		ALLUSERSPROFILE: string;
		AMOY_RPC_URL: string;
		APPDATA: string;
		BODY_SIZE_LIMIT: string;
		BUN_INSPECT_CONNECT_TO: string;
		ChocolateyInstall: string;
		ChocolateyLastPathUpdate: string;
		CHROME_CRASHPAD_PIPE_NAME: string;
		CLAUDE_CODE_SSE_PORT: string;
		COLORTERM: string;
		CommonProgramFiles: string;
		CommonProgramW6432: string;
		COMPUTERNAME: string;
		ComSpec: string;
		COPILOT_DEBUG_NONCE: string;
		DriverData: string;
		ENCODER_MINIO_ROOT_PASSWORD: string;
		ENCODER_MINIO_ROOT_USER: string;
		ENCRYPTION_KEY: string;
		FPS_BROWSER_APP_PROFILE_STRING: string;
		FPS_BROWSER_USER_PROFILE_STRING: string;
		GENERIC_TIMEZONE: string;
		GIT_ASKPASS: string;
		HOMEDRIVE: string;
		HOMEPATH: string;
		LANG: string;
		LOCALAPPDATA: string;
		LOGONSERVER: string;
		N8N_HOST: string;
		N8N_PORT: string;
		N8N_RUNNERS_SECRET: string;
		NODE: string;
		NODE_ENV: string;
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
		OLLAMA_HOST: string;
		OS: string;
		Path: string;
		PATHEXT: string;
		POLYGON_RPC_URL: string;
		POSTGRES_DB: string;
		POSTGRES_USER: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		ProgramData: string;
		ProgramFiles: string;
		ProgramW6432: string;
		PROXY_HOPS: string;
		PSExecutionPolicyPreference: string;
		PSModulePath: string;
		PUBLIC: string;
		PWD: string;
		PYTHONSTARTUP: string;
		PYTHON_BASIC_REPL: string;
		SESSIONNAME: string;
		SMTP_FROM: string;
		SMTP_HOST: string;
		SMTP_PASSWORD: string;
		SMTP_PORT: string;
		SMTP_USER: string;
		SystemDrive: string;
		SystemRoot: string;
		TEMP: string;
		TEMPORAL_UI_HTPASSWD: string;
		TERM_PROGRAM: string;
		TERM_PROGRAM_VERSION: string;
		TMP: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		USERNAME: string;
		USERPROFILE: string;
		VIRTUAL_ENV: string;
		VIRTUAL_ENV_PROMPT: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		VSCODE_GIT_IPC_HANDLE: string;
		VSCODE_INJECTION: string;
		VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
		windir: string;
		WPSCLI_HOME: string;
		_OLD_VIRTUAL_PATH: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_BETTER_AUTH_URL: string;
		PUBLIC_CREATOR_PAYMENTS_AMOY: string;
		PUBLIC_ENCODER_MINIO_URL: string;
		PUBLIC_VAPID_PUBLIC_KEY: string;
		PUBLIC_API_URL: string;
		PUBLIC_MINIO_URL: string;
		PUBLIC_WALLETCONNECT_PROJECT_ID: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
