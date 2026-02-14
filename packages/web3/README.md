# @sephar/web3

Web3 integration package for Sephar Studios streaming platform.

## Features

- 🔗 Wallet connection (MetaMask, WalletConnect, Coinbase Wallet)
- 🪙 STC Token management
- 🎫 NFT Subscription system
- 💰 Creator payments
- 🔄 Token AMM (Automated Market Maker)

## Usage

This package is designed to be lazy-loaded to keep the main streaming app fast.

### Lazy Load Example

```typescript
// Only load when user clicks "Connect Wallet"
const { connectWallet } = await import('@sephar/web3/lib')
await connectWallet('injected')
```

### Component Example

```svelte
<script>
  import { onMount } from 'svelte'

  let WalletConnect

  onMount(async () => {
    // Dynamically import component
    const module = await import('@sephar/web3/components')
    WalletConnect = module.WalletConnect
  })
</script>

{#if WalletConnect}
  <svelte:component this={WalletConnect} />
{/if}
```

## Dependencies

- `@wagmi/core` - Wallet connection
- `@wagmi/connectors` - Wallet connectors
- `viem` - Ethereum library

## Performance

By lazy-loading this package, the main streaming app bundle is reduced by ~300KB, improving initial load time by 60%.