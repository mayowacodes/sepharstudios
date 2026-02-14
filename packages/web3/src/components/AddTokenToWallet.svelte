<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Copy, CheckCheck, Plus, ExternalLink, AlertCircle } from '@lucide/svelte';
  import { isConnected, walletAddress } from '$lib/web3/wallet';
  import { getContractAddresses } from '$lib/web3/config';
  import { getChainId } from '@wagmi/core';
  import { config } from '$lib/web3/config';

  let copied = $state(false);
  let addingToken = $state(false);
  let addedSuccessfully = $state(false);

  // Token information
  const TOKEN_INFO = {
    symbol: 'STC',
    name: 'Studio Token',
    decimals: 18,
    image: 'https://sepharstudios.com/tokens/stc-logo.png' // You'll need to upload this
  };

  // Get contract address for current chain
  function getTokenAddress() {
    try {
      const chainId = getChainId(config) as any;
      const addresses = getContractAddresses(chainId);
      return addresses.studioToken;
    } catch {
      return '';
    }
  }

  async function copyAddress() {
    const address = getTokenAddress();
    if (address) {
      await navigator.clipboard.writeText(address);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }

  async function addTokenToWallet() {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install MetaMask to add tokens.');
      return;
    }

    addingToken = true;
    const tokenAddress = getTokenAddress();

    try {
      // Request to add token to wallet
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: TOKEN_INFO.symbol,
            decimals: TOKEN_INFO.decimals,
            image: TOKEN_INFO.image,
          },
        },
      });

      if (wasAdded) {
        addedSuccessfully = true;
        setTimeout(() => addedSuccessfully = false, 5000);
      }
    } catch (error) {
      console.error('Error adding token:', error);
      alert('Failed to add token to wallet. Please try manually adding it.');
    } finally {
      addingToken = false;
    }
  }

  async function switchToPolygon() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon mainnet
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
        }
      }
    }
  }

  function getExplorerUrl() {
    const address = getTokenAddress();
    const chainId = getChainId(config);

    if (chainId === 137) {
      return `https://polygonscan.com/token/${address}`;
    } else if (chainId === 80001) {
      return `https://mumbai.polygonscan.com/token/${address}`;
    }
    return '';
  }
</script>

<Card class="max-w-md">
  <CardHeader>
    <CardTitle class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <span class="text-primary-foreground font-bold text-sm">STC</span>
      </div>
      <span>Add STC Token to Wallet</span>
    </CardTitle>
  </CardHeader>

  <CardContent class="space-y-4">
    {#if !$isConnected}
      <div class="p-3 bg-muted/20 rounded-lg text-center">
        <AlertCircle class="mx-auto h-6 w-6 text-muted-foreground mb-2" />
        <p class="text-sm text-muted-foreground">Connect your wallet first to add STC tokens</p>
      </div>
    {:else}
      <!-- Token Information -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Token Name:</span>
          <span class="font-medium">{TOKEN_INFO.name}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Symbol:</span>
          <Badge variant="outline">{TOKEN_INFO.symbol}</Badge>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Decimals:</span>
          <span class="font-medium">{TOKEN_INFO.decimals}</span>
        </div>

        <div class="space-y-2">
          <span class="text-sm text-muted-foreground">Contract Address:</span>
          <div class="flex items-center space-x-2">
            <code class="flex-1 p-2 bg-muted rounded text-xs font-mono truncate">
              {getTokenAddress() || 'Deploy contracts first'}
            </code>
            {#if getTokenAddress()}
              <Button
                variant="ghost"
                size="sm"
                onclick={copyAddress}
                class="h-8 w-8 p-0"
              >
                {#if copied}
                  <CheckCheck class="h-3 w-3 text-primary" />
                {:else}
                  <Copy class="h-3 w-3" />
                {/if}
              </Button>
            {/if}
          </div>
        </div>
      </div>

      {#if getTokenAddress()}
        <!-- Add Token Button -->
        <div class="space-y-2">
          <Button
            class="w-full"
            onclick={addTokenToWallet}
            disabled={addingToken}
          >
            {#if addingToken}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Token...
            {:else}
              <Plus class="mr-2 h-4 w-4" />
              Add STC to MetaMask
            {/if}
          </Button>

          {#if addedSuccessfully}
            <div class="p-2 bg-primary/10 border border-primary/20 rounded-lg text-center">
              <p class="text-sm text-primary font-medium">✓ Token added successfully!</p>
              <p class="text-xs text-muted-foreground mt-1">
                STC should now appear in your wallet
              </p>
            </div>
          {/if}
        </div>

        <!-- Manual Instructions -->
        <div class="border-t pt-4">
          <h4 class="text-sm font-medium mb-2">Manual Addition Instructions:</h4>
          <ol class="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Open MetaMask and click "Import tokens"</li>
            <li>Select "Custom token"</li>
            <li>Paste the contract address above</li>
            <li>Symbol and decimals should auto-fill</li>
            <li>Click "Add Custom Token"</li>
          </ol>
        </div>

        <!-- Explorer Link -->
        {#if getExplorerUrl()}
          <Button
            variant="outline"
            size="sm"
            class="w-full"
            href={getExplorerUrl()}
            target="_blank"
          >
            <ExternalLink class="mr-2 h-3 w-3" />
            View on PolygonScan
          </Button>
        {/if}

        <!-- Network Switch (if not on Polygon) -->
        {#if getChainId(config) !== 137}
          <div class="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
            <div class="flex items-start space-x-2">
              <AlertCircle class="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
              <div class="space-y-2">
                <p class="text-sm font-medium">Switch to Polygon Network</p>
                <p class="text-xs text-muted-foreground">
                  STC tokens are deployed on Polygon for lower gas fees
                </p>
                <Button size="sm" onclick={switchToPolygon}>
                  Switch to Polygon
                </Button>
              </div>
            </div>
          </div>
        {/if}
      {:else}
        <div class="p-3 bg-muted/20 rounded-lg text-center">
          <AlertCircle class="mx-auto h-6 w-6 text-muted-foreground mb-2" />
          <p class="text-sm text-muted-foreground">
            STC tokens will be available after contract deployment
          </p>
        </div>
      {/if}
    {/if}
  </CardContent>
</Card>

<style>
  /* Custom styles for better visual feedback */
  :global(.animate-spin) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>