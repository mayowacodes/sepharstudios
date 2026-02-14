# StudioChain Project Restructuring Plan

## Overview
Restructure the current monolithic SvelteKit application into a proper monorepo structure to solve the Vercel 250MB serverless function limit and improve maintainability.

## Current Issues
- **Size Problem**: Serverless functions exceed 250MB due to Web3 dependencies
- **Mixed Concerns**: Client-side Web3 code in server hooks
- **Dependency Chaos**: Blockchain dev tools bundled with production server code
- **Poor Separation**: No clear client/server boundaries

## Target Structure

```
studiochain/
├── apps/
│   ├── web/                     # Main SvelteKit app (client-focused)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/  # UI components (client-only)
│   │   │   │   ├── stores/      # Client state management
│   │   │   │   └── web3/        # Web3 logic (client-only)
│   │   │   ├── routes/
│   │   │   │   ├── (app)/       # Public pages
│   │   │   │   ├── (admin)/     # Admin dashboard
│   │   │   │   └── api/         # Minimal server endpoints
│   │   │   ├── hooks.client.ts  # Client-only hooks
│   │   │   └── hooks.server.ts  # Lightweight server hooks
│   │   ├── package.json         # Client + minimal server deps
│   │   ├── svelte.config.js     # Optimized config
│   │   └── vite.config.ts       # Bundle optimization
│   │
│   └── api/ (Optional)          # Separate API server
│       ├── src/
│       │   ├── routes/          # Heavy API endpoints
│       │   └── lib/
│       └── package.json         # Server-only dependencies
│
├── packages/
│   ├── contracts/               # Smart contracts (moved from root)
│   │   ├── contracts/
│   │   ├── scripts/
│   │   ├── hardhat.config.ts
│   │   └── package.json         # Blockchain dev dependencies
│   │
│   ├── shared/                  # Shared utilities
│   │   ├── src/
│   │   │   ├── types/           # Shared TypeScript types
│   │   │   ├── constants/       # App constants
│   │   │   └── utils/           # Shared utilities
│   │   └── package.json
│   │
│   └── ui/                      # Shared UI components (optional)
│       ├── src/components/
│       └── package.json
│
├── tools/
│   ├── eslint-config/           # Shared ESLint config
│   └── tsconfig/                # Shared TypeScript configs
│
├── package.json                 # Root workspace config
├── pnpm-workspace.yaml          # Workspace definition
├── turbo.json                   # Build orchestration
└── .env                         # Root environment variables
```

## Migration Steps

### Phase 1: Setup Workspace (30 minutes)
1. **Create workspace structure**
   ```bash
   mkdir -p apps/web packages/contracts packages/shared tools/eslint-config tools/tsconfig
   ```

2. **Initialize pnpm workspace**
   ```yaml
   # pnpm-workspace.yaml
   packages:
     - "apps/*"
     - "packages/*"
     - "tools/*"
   ```

3. **Create root package.json**
   ```json
   {
     "name": "studiochain",
     "private": true,
     "scripts": {
       "dev": "turbo run dev",
       "build": "turbo run build",
       "build:web": "turbo run build --filter=@studiochain/web"
     },
     "devDependencies": {
       "turbo": "latest"
     }
   }
   ```

### Phase 2: Move Contracts (15 minutes)
1. **Move contracts directory**
   ```bash
   mv contracts/ packages/contracts/
   ```

2. **Update contracts package.json**
   ```json
   {
     "name": "@studiochain/contracts",
     "version": "1.0.0",
     "scripts": {
       "build": "hardhat compile",
       "deploy": "hardhat run scripts/deploy.ts"
     }
   }
   ```

### Phase 3: Create Web App Structure (45 minutes)
1. **Move src to apps/web**
   ```bash
   mkdir -p apps/web
   mv src/ apps/web/src/
   mv static/ apps/web/static/
   ```

2. **Copy and modify config files**
   ```bash
   cp svelte.config.js apps/web/
   cp vite.config.ts apps/web/
   cp tailwind.config.ts apps/web/
   cp tsconfig.json apps/web/
   ```

3. **Create optimized apps/web/package.json**
   ```json
   {
     "name": "@studiochain/web",
     "version": "1.0.0",
     "scripts": {
       "dev": "vite dev",
       "build": "vite build",
       "preview": "vite preview"
     },
     "dependencies": {
       "@clerk/themes": "^2.2.24",
       "@toolsntuts/utils": "^0.2.9",
       "@xata.io/client": "^0.0.0-next.v93343b9646f57a1e5c51c35eccf0767c2bb80baa",
       "lodash-es": "^4.17.21",
       "lucide-svelte": "^0.473.0",
       "shadcn-svelte": "^0.14.0",
       "svelte-clerk": "^0.7.5",
       "svix": "^1.62.0"
     },
     "devDependencies": {
       "@sveltejs/adapter-vercel": "^5.6.3",
       "@sveltejs/kit": "^2.20.1",
       "@wagmi/connectors": "^5.11.1",
       "@wagmi/core": "^2.21.1",
       "@walletconnect/ethereum-provider": "^2.21.9",
       "@reown/appkit": "^1.8.7",
       "viem": "^2.37.8",
       "wagmi": "^2.17.4",
       "hls.js": "^1.6.0"
     }
   }
   ```

### Phase 4: Optimize Configuration (30 minutes)
1. **Update apps/web/svelte.config.js**
   ```javascript
   import adapter from '@sveltejs/adapter-vercel';
   import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

   const config = {
     preprocess: vitePreprocess(),
     kit: {
       adapter: adapter({
         external: [
           // Exclude ALL Web3 from serverless functions
           '@wagmi/connectors', '@wagmi/core', 'wagmi', 'viem',
           '@walletconnect/ethereum-provider', '@reown/appkit',
           'hls.js', 'lucide-svelte'
         ],
         runtime: 'edge',
         memory: 512,
         split: true
       })
     }
   };
   export default config;
   ```

2. **Update apps/web/vite.config.ts**
   ```typescript
   import { sveltekit } from '@sveltejs/kit/vite';
   import { defineConfig } from 'vite';

   export default defineConfig({
     plugins: [sveltekit()],
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'web3': ['@wagmi/core', 'wagmi', 'viem'],
             'ui': ['lucide-svelte', 'shadcn-svelte'],
             'media': ['hls.js']
           }
         }
       }
     },
     ssr: {
       noExternal: ['@clerk/themes', 'svelte-clerk']
     }
   });
   ```

### Phase 5: Split Hooks (20 minutes)
1. **Create apps/web/src/hooks.client.ts**
   ```typescript
   import type { HandleClientError } from '@sveltejs/kit';
   import { autoConnect } from '$lib/web3/wallet';

   // Client-side Web3 initialization
   export const handleError: HandleClientError = async ({ error }) => {
     console.error('Client error:', error);
   };

   // Initialize Web3 on client
   if (typeof window !== 'undefined') {
     autoConnect();
   }
   ```

2. **Simplify apps/web/src/hooks.server.ts**
   ```typescript
   import { withClerkHandler } from 'svelte-clerk/server';
   import type { Handle } from '@sveltejs/kit';

   // Pure server-side authentication only
   export const handle: Handle = withClerkHandler();
   ```

### Phase 6: Create Shared Packages (25 minutes)
1. **Create packages/shared/package.json**
   ```json
   {
     "name": "@studiochain/shared",
     "version": "1.0.0",
     "type": "module",
     "exports": {
       "./types": "./src/types/index.ts",
       "./utils": "./src/utils/index.ts",
       "./constants": "./src/constants/index.ts"
     }
   }
   ```

2. **Move shared types**
   ```bash
   mkdir -p packages/shared/src/{types,utils,constants}
   # Move common types from apps/web/src/lib/types/
   ```

### Phase 7: Setup Build Orchestration (15 minutes)
1. **Create turbo.json**
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "pipeline": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": [".svelte-kit/**", "dist/**"]
       },
       "dev": {
         "cache": false,
         "persistent": true
       }
     }
   }
   ```

### Phase 8: Update Scripts and Deploy (20 minutes)
1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Test build**
   ```bash
   pnpm build:web
   ```

3. **Deploy**
   ```bash
   cd apps/web && vercel deploy
   ```

## Expected Outcomes

### Size Reduction
- **Before**: 250MB+ (failing)
- **After**: <50MB (passing)
- **Reduction**: 80%+ size decrease

### Performance Improvements
- **Build Time**: 40% faster with Turbo
- **Cold Start**: 60% faster with edge runtime
- **Bundle Size**: 50% smaller client bundles

### Developer Experience
- **Clear Separation**: Client vs server vs blockchain code
- **Better Types**: Shared type definitions
- **Easier Debugging**: Isolated concerns
- **Scalable**: Easy to add new apps/packages

## Rollback Plan
If issues occur:
1. Keep original structure in git branch
2. Quick rollback: `git checkout main-backup`
3. Gradual migration: Move packages one by one

## Timeline
- **Total Time**: ~3 hours
- **Critical Path**: Phases 1-5 (2 hours)
- **Testing**: 30 minutes
- **Buffer**: 30 minutes

## Success Metrics
- ✅ Vercel build succeeds
- ✅ Bundle size under 50MB
- ✅ All routes functional
- ✅ Web3 functionality intact
- ✅ Build time improved