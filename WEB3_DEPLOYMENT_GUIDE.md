# 🔗 Sephar Studios - Web3 Deployment Guide

Complete guide for deploying blockchain features: STC Token, NFT Subscriptions, Creator Payments, and AMM.

---

## 📋 Web3 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Sephar Studios Web3 Ecosystem                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (packages/web3)                                   │
│  ├── Lazy-loaded Web3 components                          │
│  ├── WalletConnect integration                             │
│  └── Contract interaction layer                            │
│                                                             │
│  Smart Contracts (packages/contracts)                       │
│  ├── StudioToken.sol          (STC - ERC20)               │
│  ├── SepharSubscription.sol   (NFT - ERC721)              │
│  ├── CreatorPayments.sol      (Revenue distribution)       │
│  ├── TokenAMM.sol             (STC/USDC swap)              │
│  └── MockUSDC.sol             (Testnet only)               │
│                                                             │
│  Blockchain Networks                                        │
│  ├── Mumbai Testnet   (Development/Testing)               │
│  └── Polygon Mainnet  (Production)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Phase 1: Environment Setup (15 minutes)

### Step 1.1: Install Web3 Dependencies

```bash
# Install workspace dependencies
bun install

# Verify web3 package is linked
cd packages/web3
bun install
```

### Step 1.2: Get Required Keys & Accounts

#### WalletConnect Project ID ❌ REQUIRED
1. Visit: https://cloud.walletconnect.com/
2. Sign up/Login with GitHub or Email
3. Click **"Create Project"**
4. Project Name: `Sephar Studios`
5. Copy the **Project ID**

Add to root `.env`:
```bash
PUBLIC_WALLETCONNECT_PROJECT_ID=abc123def456...
```

#### Deployer Wallet ❌ REQUIRED
You need a wallet with private key to deploy contracts.

**Option A: Create New Wallet (Recommended for testnet)**
```bash
# Using Node.js
node -e "const {Wallet} = require('ethers'); const w = Wallet.createRandom(); console.log('Address:', w.address); console.log('Private Key:', w.privateKey);"
```

**Option B: Export from MetaMask**
- MetaMask → Account Details → Export Private Key
- ⚠️ **NEVER commit this to git!**

#### Polygonscan API Key ⚠️ OPTIONAL (for contract verification)
1. Visit: https://polygonscan.com/apis
2. Sign up and create API key
3. Copy the key

### Step 1.3: Configure Contracts Environment

```bash
cd packages/contracts

# Create .env file
cat > .env << 'EOF'
# Deployer wallet (KEEP SECRET!)
PRIVATE_KEY=0xYourPrivateKeyHere

# RPC URLs (Using public RPCs)
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGON_RPC_URL=https://polygon-rpc.com

# Polygonscan API (for verification - optional)
POLYGONSCAN_API_KEY=YourPolygonscanApiKey

# Initial Token Supply (10 million STC)
INITIAL_SUPPLY=10000000

# AMM Initial Liquidity
INITIAL_STC_LIQUIDITY=100000
INITIAL_USDC_LIQUIDITY=10000
EOF

# Secure the .env file
chmod 600 .env
```

---

## 🪙 Phase 2: Get Testnet MATIC (10 minutes)

### Step 2.1: Get Mumbai Testnet MATIC

Your deployer wallet needs MATIC for gas fees.

**Option 1: Polygon Faucet (Recommended)**
1. Visit: https://faucet.polygon.technology/
2. Select **Mumbai** network
3. Paste your deployer wallet address
4. Complete captcha
5. Click **Submit**
6. Wait 1-2 minutes

**Option 2: Alchemy Faucet**
1. Visit: https://mumbaifaucet.com/
2. Enter wallet address
3. Get 0.5 MATIC

**Option 3: QuickNode Faucet**
1. Visit: https://faucet.quicknode.com/polygon/mumbai
2. Enter address
3. Get 0.1 MATIC

### Step 2.2: Verify Balance

```bash
# Check balance
node -e "const {JsonRpcProvider, Wallet} = require('ethers'); const provider = new JsonRpcProvider('https://rpc-mumbai.maticvigil.com'); const wallet = new Wallet(process.env.PRIVATE_KEY, provider); wallet.getBalance().then(b => console.log('Balance:', b.toString() / 1e18, 'MATIC'));"
```

You need at least **0.5 MATIC** for deployment.

---

## 📝 Phase 3: Smart Contract Deployment (30 minutes)

### Step 3.1: Compile Contracts

```bash
cd packages/contracts

# Clean previous builds
bun run clean

# Compile contracts
bun run compile

# Check for compilation errors
# Should see: "Compiled X Solidity files successfully"
```

### Step 3.2: Deploy to Mumbai Testnet

```bash
# Deploy all contracts
bun run deploy:mumbai

# Expected output:
# Deploying contracts to Mumbai testnet...
# ✅ StudioToken deployed to: 0xABC123...
# ✅ MockUSDC deployed to: 0xDEF456...
# ✅ TokenAMM deployed to: 0xGHI789...
# ✅ SepharSubscription deployed to: 0xJKL012...
# ✅ CreatorPayments deployed to: 0xMNO345...
#
# 🎉 Deployment complete!
```

**⚠️ IMPORTANT**: Save these contract addresses! You'll need them.

### Step 3.3: Save Contract Addresses

Copy the deployment output to a file:

```bash
# Save to deployments file
cat > deployments/mumbai.json << EOF
{
  "network": "mumbai",
  "chainId": 80001,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "studioToken": "0xYourStudioTokenAddress",
    "mockUSDC": "0xYourMockUSDCAddress",
    "tokenAMM": "0xYourTokenAMMAddress",
    "sepharSubscription": "0xYourSubscriptionAddress",
    "creatorPayments": "0xYourCreatorPaymentsAddress"
  },
  "deployer": "0xYourDeployerAddress"
}
EOF
```

### Step 3.4: Verify Contracts on Polygonscan (Optional)

```bash
# Verify StudioToken
npx hardhat verify --network mumbai <STUDIO_TOKEN_ADDRESS>

# Verify SepharSubscription
npx hardhat verify --network mumbai <SUBSCRIPTION_ADDRESS>

# Verify CreatorPayments
npx hardhat verify --network mumbai <CREATOR_PAYMENTS_ADDRESS>

# Verify TokenAMM
npx hardhat verify --network mumbai <TOKEN_AMM_ADDRESS>
```

Verified contracts will show source code on: https://mumbai.polygonscan.com/

---

## 🔧 Phase 4: Update Frontend Configuration (15 minutes)

### Step 4.1: Update Web3 Config

Edit `packages/web3/src/lib/config.ts`:

```typescript
// Replace 'demo-project-id' with your real WalletConnect Project ID
const projectId = process.env.PUBLIC_WALLETCONNECT_PROJECT_ID || 'your_project_id_here'

// Update contract addresses
export const CONTRACT_ADDRESSES = {
  [polygonMumbai.id]: {
    studioToken: '0xYourStudioTokenAddress',      // ← From deployment
    sepharSubscription: '0xYourSubscriptionAddress', // ← From deployment
    creatorPayments: '0xYourCreatorPaymentsAddress',   // ← From deployment
    tokenAMM: '0xYourTokenAMMAddress',             // ← From deployment
    usdcToken: '0xYourMockUSDCAddress'             // ← From deployment (testnet)
  },
  [polygon.id]: {
    studioToken: '',        // ← Deploy to mainnet later
    sepharSubscription: '',
    creatorPayments: '',
    tokenAMM: '',
    usdcToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' // Polygon USDC
  }
}
```

### Step 4.2: Update Environment Variables

Add to root `.env`:

```bash
# WalletConnect
PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_from_cloud_walletconnect

# Contract Addresses - Mumbai Testnet
PUBLIC_STC_TOKEN_MUMBAI=0xYourStudioTokenAddress
PUBLIC_SUBSCRIPTION_NFT_MUMBAI=0xYourSubscriptionAddress
PUBLIC_CREATOR_PAYMENTS_MUMBAI=0xYourCreatorPaymentsAddress
PUBLIC_TOKEN_AMM_MUMBAI=0xYourTokenAMMAddress
PUBLIC_USDC_MUMBAI=0xYourMockUSDCAddress

# RPC URLs (optional - using public RPCs by default)
PUBLIC_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
```

### Step 4.3: Rebuild Web3 Package

```bash
cd packages/web3
bun run build

# Verify no TypeScript errors
bun run type-check
```

---

## 🧪 Phase 5: Testing Web3 Features (30 minutes)

### Step 5.1: Start Development Server

```bash
# From root
bun install
bun run dev

# App should start at http://localhost:5173
```

### Step 5.2: Configure MetaMask

1. Open MetaMask
2. **Add Mumbai Network**:
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://rpc-mumbai.maticvigil.com`
   - Chain ID: `80001`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com`

3. **Import Test Tokens** (Optional):
   - Add custom token
   - Paste your STC token address
   - Symbol: `STC`
   - Decimals: `18`

### Step 5.3: Test Wallet Connection

1. Navigate to: `http://localhost:5173/wallet`
2. Click **"Connect Wallet"**
3. Select **MetaMask**
4. Approve connection
5. Should show your wallet address and balance

**Troubleshooting**:
- If "Loading wallet connection..." hangs → Check console for errors
- If "Failed to load wallet" → Verify `PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- If wrong network → Switch MetaMask to Mumbai

### Step 5.4: Test Token Features

Navigate to: `http://localhost:5173/tokens`

**Test Cases**:
- [ ] Shows STC balance (should be 0 initially)
- [ ] Shows USDC balance
- [ ] "Stake for Discount" button visible
- [ ] "Swap" functionality visible
- [ ] No console errors

### Step 5.5: Test Subscription NFT

Navigate to: `http://localhost:5173/subscription`

**Test Cases**:
- [ ] Shows subscription tiers (Basic, Premium, Creator)
- [ ] "Mint NFT" button visible
- [ ] Price displays correctly
- [ ] Benefits listed for each tier
- [ ] No console errors

### Step 5.6: Get Test Tokens

To actually test transactions, you need STC tokens:

```bash
# Use Hardhat console
cd packages/contracts
npx hardhat console --network mumbai

# In console:
const StudioToken = await ethers.getContractFactory("StudioToken");
const token = await StudioToken.attach("YOUR_TOKEN_ADDRESS");
await token.transfer("YOUR_WALLET_ADDRESS", ethers.parseEther("1000"));

# Exit console
.exit
```

Now refresh `/tokens` page - should show 1000 STC!

### Step 5.7: Test Token Swap

1. Navigate to `/tokens`
2. Click **"Swap"** tab
3. Enter amount (e.g., 10 STC)
4. Click **"Swap STC for USDC"**
5. Approve transaction in MetaMask
6. Wait for confirmation
7. Balance should update

### Step 5.8: Test NFT Subscription

1. Navigate to `/subscription`
2. Choose tier (e.g., Premium - $9.99)
3. Click **"Subscribe Now"**
4. Approve transaction
5. Wait for confirmation
6. Should show "Active Subscription"

---

## 🐳 Phase 6: Docker Integration (15 minutes)

### Step 6.1: Add Web3 to Docker Build

Your current Dockerfile needs updating. Create `Dockerfile.web3`:

```dockerfile
# Multi-stage build for monorepo with Web3
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy workspace files
COPY bun.lock package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/web3/package.json ./packages/web3/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps ./apps
COPY packages ./packages

# Build web3 package first
WORKDIR /app/packages/web3
RUN bun run build

# Build web app
WORKDIR /app/apps/web
RUN bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built app
COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD bun run -e "fetch('http://localhost:3000').then(r => r.ok ? 0 : 1)"

CMD ["bun", "run", "build/index.js"]
```

### Step 6.2: Build Docker Image with Web3

```bash
# Build
docker build -f Dockerfile.web3 -t manimasaun/sepharstudios:web3-latest .

# Test locally
docker run -p 3000:3000 \
  -e PUBLIC_WALLETCONNECT_PROJECT_ID=your_id \
  -e PUBLIC_STC_TOKEN_MUMBAI=0x... \
  -e PUBLIC_SUBSCRIPTION_NFT_MUMBAI=0x... \
  -e PUBLIC_CREATOR_PAYMENTS_MUMBAI=0x... \
  -e PUBLIC_TOKEN_AMM_MUMBAI=0x... \
  --env-file .env \
  manimasaun/sepharstudios:web3-latest

# Push to registry
docker push manimasaun/sepharstudios:web3-latest
```

### Step 6.3: Update docker-compose.yml

Add Web3 environment variables:

```yaml
services:
  sepharstudios:
    image: manimasaun/sepharstudios:web3-latest
    environment:
      # ... existing vars ...

      # Web3 Configuration
      - PUBLIC_WALLETCONNECT_PROJECT_ID=${PUBLIC_WALLETCONNECT_PROJECT_ID}

      # Contract Addresses - Mumbai
      - PUBLIC_STC_TOKEN_MUMBAI=${PUBLIC_STC_TOKEN_MUMBAI}
      - PUBLIC_SUBSCRIPTION_NFT_MUMBAI=${PUBLIC_SUBSCRIPTION_NFT_MUMBAI}
      - PUBLIC_CREATOR_PAYMENTS_MUMBAI=${PUBLIC_CREATOR_PAYMENTS_MUMBAI}
      - PUBLIC_TOKEN_AMM_MUMBAI=${PUBLIC_TOKEN_AMM_MUMBAI}
      - PUBLIC_USDC_MUMBAI=${PUBLIC_USDC_MUMBAI}

      # RPC URLs (optional)
      - PUBLIC_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
      - PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
```

---

## 🚀 Phase 7: Production Deployment (Polygon Mainnet)

### ⚠️ **ONLY DO THIS AFTER THOROUGH TESTNET TESTING!**

### Step 7.1: Get Production MATIC

You need real MATIC for mainnet deployment (~$50-100 worth):

1. Buy MATIC on exchange (Coinbase, Binance, etc.)
2. Withdraw to your deployer wallet address
3. Network: **Polygon** (not Ethereum!)

### Step 7.2: Update Contracts .env

```bash
cd packages/contracts

# Add mainnet config to .env
cat >> .env << 'EOF'

# Mainnet Configuration
POLYGON_PRIVATE_KEY=0xYourProductionDeployerKey
MAINNET_INITIAL_SUPPLY=10000000
MAINNET_INITIAL_STC_LIQUIDITY=100000
MAINNET_INITIAL_USDC_LIQUIDITY=10000
EOF
```

### Step 7.3: Deploy to Polygon Mainnet

```bash
cd packages/contracts

# Final check
bun run compile

# Deploy (THIS COSTS REAL MONEY!)
bun run deploy:polygon

# Save output addresses!
```

### Step 7.4: Verify on Polygonscan

```bash
# Verify all contracts
npx hardhat verify --network polygon <STUDIO_TOKEN_ADDRESS>
npx hardhat verify --network polygon <SUBSCRIPTION_ADDRESS>
npx hardhat verify --network polygon <CREATOR_PAYMENTS_ADDRESS>
npx hardhat verify --network polygon <TOKEN_AMM_ADDRESS>
```

### Step 7.5: Update Production Config

Update `packages/web3/src/lib/config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  [polygon.id]: {
    studioToken: '0xYourMainnetTokenAddress',
    sepharSubscription: '0xYourMainnetSubscriptionAddress',
    creatorPayments: '0xYourMainnetCreatorPaymentsAddress',
    tokenAMM: '0xYourMainnetAMMAddress',
    usdcToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
  }
}

// Switch default to mainnet
export const DEFAULT_CHAIN = polygon // Was polygonMumbai
```

### Step 7.6: Update Production .env

```bash
# Add mainnet contract addresses
PUBLIC_STC_TOKEN_POLYGON=0x...
PUBLIC_SUBSCRIPTION_NFT_POLYGON=0x...
PUBLIC_CREATOR_PAYMENTS_POLYGON=0x...
PUBLIC_TOKEN_AMM_POLYGON=0x...
```

### Step 7.7: Rebuild & Redeploy

```bash
# Rebuild everything
bun install
bun run build

# Build new Docker image
docker build -f Dockerfile.web3 -t manimasaun/sepharstudios:mainnet .

# Push
docker push manimasaun/sepharstudios:mainnet

# Update Dokploy to use :mainnet tag
```

---

## 📊 Web3 Monitoring & Maintenance

### Contract Monitoring

Monitor your contracts on:
- **Mumbai**: https://mumbai.polygonscan.com/
- **Polygon**: https://polygonscan.com/

Track:
- [ ] Token transfers
- [ ] NFT mints
- [ ] AMM swaps
- [ ] Creator payments
- [ ] Gas usage

### Web3 Analytics

Track Web3 adoption:
```typescript
// Add to analytics
{
  "web3_wallets_connected": count,
  "subscriptions_minted": count,
  "tokens_staked": amount,
  "amm_swaps": count
}
```

### Security Best Practices

- [ ] Never commit private keys
- [ ] Use hardware wallet for mainnet deployment
- [ ] Enable multisig for contract ownership
- [ ] Regular security audits
- [ ] Monitor for unusual transactions
- [ ] Keep emergency pause mechanism
- [ ] Backup contract verification artifacts

---

## 🐛 Troubleshooting

### Issue: "Failed to load Web3"
**Solution**: Check `PUBLIC_WALLETCONNECT_PROJECT_ID` is set and valid

### Issue: "Wrong network"
**Solution**: User needs to switch MetaMask to Mumbai/Polygon

### Issue: "Transaction failed"
**Solution**:
- Check user has enough MATIC for gas
- Verify contract addresses are correct
- Check contract is not paused

### Issue: "Cannot read properties of undefined"
**Solution**: Lazy loading failed - check dynamic imports in web3-lazy components

### Issue: "Insufficient funds"
**Solution**: User needs testnet MATIC from faucet

---

## ✅ Web3 Deployment Checklist

### Development
- [ ] WalletConnect Project ID obtained
- [ ] Deployer wallet created
- [ ] Mumbai testnet MATIC obtained (0.5+)
- [ ] Contracts compiled successfully
- [ ] Contracts deployed to Mumbai
- [ ] Contract addresses saved
- [ ] Frontend config updated
- [ ] Wallet connection tested
- [ ] Token features tested
- [ ] NFT subscription tested
- [ ] AMM swap tested

### Docker & Production
- [ ] Dockerfile updated for monorepo
- [ ] Docker image builds successfully
- [ ] Web3 env vars added to docker-compose
- [ ] Image pushed to registry
- [ ] Deployed to Dokploy
- [ ] Web3 features work in production
- [ ] Contract addresses in production config

### Mainnet (Later)
- [ ] Thorough testnet testing completed
- [ ] Production MATIC obtained
- [ ] Contracts deployed to Polygon
- [ ] Contracts verified on Polygonscan
- [ ] Production config updated
- [ ] New Docker image deployed
- [ ] All features tested on mainnet

---

## 📝 Commands Quick Reference

```bash
# Get testnet MATIC
open https://faucet.polygon.technology/

# Compile contracts
cd packages/contracts && bun run compile

# Deploy to Mumbai
bun run deploy:mumbai

# Verify contracts
npx hardhat verify --network mumbai <ADDRESS>

# Test locally
cd apps/web && bun run dev

# Build Docker with Web3
docker build -f Dockerfile.web3 -t manimasaun/sepharstudios:web3 .

# Deploy to mainnet (CAREFUL!)
bun run deploy:polygon
```

---

## 🔗 Important Links

- **WalletConnect Cloud**: https://cloud.walletconnect.com/
- **Mumbai Faucet**: https://faucet.polygon.technology/
- **Mumbai Explorer**: https://mumbai.polygonscan.com/
- **Polygon Explorer**: https://polygonscan.com/
- **Hardhat Docs**: https://hardhat.org/
- **Wagmi Docs**: https://wagmi.sh/
- **Viem Docs**: https://viem.sh/

---

**Estimated Time**: 2-3 hours for testnet deployment
**Cost**: Free (Mumbai testnet)
**Mainnet Cost**: ~$50-100 in MATIC for gas fees

Good luck! 🚀🔗