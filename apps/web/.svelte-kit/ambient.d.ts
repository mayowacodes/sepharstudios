
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
	export const AI_AGENT: string;
	export const ALLUSERSPROFILE: string;
	export const APPDATA: string;
	export const APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
	export const APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
	export const APPLICATION_INSIGHTS_NO_STATSBEAT: string;
	export const ChocolateyInstall: string;
	export const ChocolateyLastPathUpdate: string;
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const CLAUDECODE: string;
	export const CLAUDE_AGENT_SDK_VERSION: string;
	export const CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
	export const CLAUDE_CODE_ENABLE_TASKS: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const CLAUDE_CODE_EXECPATH: string;
	export const CLAUDE_CODE_SESSION_ID: string;
	export const CLAUDE_CODE_TMPDIR: string;
	export const CLAUDE_EFFORT: string;
	export const COMMONPROGRAMFILES: string;
	export const CommonProgramW6432: string;
	export const COMPUTERNAME: string;
	export const COMSPEC: string;
	export const COPILOT_OTEL_ENABLED: string;
	export const COPILOT_OTEL_EXPORTER_TYPE: string;
	export const COPILOT_OTEL_FILE_EXPORTER_PATH: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const DriverData: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const EXEPATH: string;
	export const FPS_BROWSER_APP_PROFILE_STRING: string;
	export const FPS_BROWSER_USER_PROFILE_STRING: string;
	export const GIT_CONFIG_COUNT: string;
	export const GIT_CONFIG_KEY_0: string;
	export const GIT_CONFIG_VALUE_0: string;
	export const GIT_EDITOR: string;
	export const HOME: string;
	export const HOMEDRIVE: string;
	export const HOMEPATH: string;
	export const LOCALAPPDATA: string;
	export const LOGONSERVER: string;
	export const MCP_CONNECTION_NONBLOCKING: string;
	export const MSYSTEM: string;
	export const NODE: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
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
	export const OLDPWD: string;
	export const OS: string;
	export const PATH: string;
	export const PATHEXT: string;
	export const PLINK_PROTOCOL: string;
	export const POSTHOG_API_KEY: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const ProgramData: string;
	export const PROGRAMFILES: string;
	export const ProgramW6432: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const PWD: string;
	export const SESSIONNAME: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SYSTEMDRIVE: string;
	export const SYSTEMROOT: string;
	export const TEMP: string;
	export const TERM: string;
	export const TMP: string;
	export const TMPDIR: string;
	export const TMPPREFIX: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const VIRTUAL_ENV: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const VSCODE_CWD: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_NLS_CONFIG: string;
	export const VSCODE_PID: string;
	export const WINDIR: string;
	export const _: string;
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
		AI_AGENT: string;
		ALLUSERSPROFILE: string;
		APPDATA: string;
		APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
		APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
		APPLICATION_INSIGHTS_NO_STATSBEAT: string;
		ChocolateyInstall: string;
		ChocolateyLastPathUpdate: string;
		CHROME_CRASHPAD_PIPE_NAME: string;
		CLAUDECODE: string;
		CLAUDE_AGENT_SDK_VERSION: string;
		CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
		CLAUDE_CODE_ENABLE_TASKS: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		CLAUDE_CODE_EXECPATH: string;
		CLAUDE_CODE_SESSION_ID: string;
		CLAUDE_CODE_TMPDIR: string;
		CLAUDE_EFFORT: string;
		COMMONPROGRAMFILES: string;
		CommonProgramW6432: string;
		COMPUTERNAME: string;
		COMSPEC: string;
		COPILOT_OTEL_ENABLED: string;
		COPILOT_OTEL_EXPORTER_TYPE: string;
		COPILOT_OTEL_FILE_EXPORTER_PATH: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		DriverData: string;
		ELECTRON_RUN_AS_NODE: string;
		EXEPATH: string;
		FPS_BROWSER_APP_PROFILE_STRING: string;
		FPS_BROWSER_USER_PROFILE_STRING: string;
		GIT_CONFIG_COUNT: string;
		GIT_CONFIG_KEY_0: string;
		GIT_CONFIG_VALUE_0: string;
		GIT_EDITOR: string;
		HOME: string;
		HOMEDRIVE: string;
		HOMEPATH: string;
		LOCALAPPDATA: string;
		LOGONSERVER: string;
		MCP_CONNECTION_NONBLOCKING: string;
		MSYSTEM: string;
		NODE: string;
		NoDefaultCurrentDirectoryInExePath: string;
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
		OLDPWD: string;
		OS: string;
		PATH: string;
		PATHEXT: string;
		PLINK_PROTOCOL: string;
		POSTHOG_API_KEY: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		ProgramData: string;
		PROGRAMFILES: string;
		ProgramW6432: string;
		PSModulePath: string;
		PUBLIC: string;
		PWD: string;
		SESSIONNAME: string;
		SHELL: string;
		SHLVL: string;
		SYSTEMDRIVE: string;
		SYSTEMROOT: string;
		TEMP: string;
		TERM: string;
		TMP: string;
		TMPDIR: string;
		TMPPREFIX: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		USERNAME: string;
		USERPROFILE: string;
		VIRTUAL_ENV: string;
		VSCODE_CODE_CACHE_PATH: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		VSCODE_CWD: string;
		VSCODE_ESM_ENTRYPOINT: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_NLS_CONFIG: string;
		VSCODE_PID: string;
		WINDIR: string;
		_: string;
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
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
