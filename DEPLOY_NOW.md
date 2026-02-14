# 🚀 Deploy Contracts NOW - Step by Step

**You have**: 0.1 MATIC on Amoy ✅
**Time needed**: 15 minutes
**Status**: READY TO DEPLOY! 🎉

---

## 📝 **Step 1: Add Your Private Key** (2 minutes)

```bash
# Edit contracts/.env file
cd packages/contracts

# Add your wallet private key
# In packages/contracts/.env, replace:
PRIVATE_KEY=your_wallet_private_key_here
# With your actual private key
```

### How to Get Your Private Key:

**From MetaMask:**
1. Open MetaMask
2. Click three dots (⋮) next to your account
3. Click "Account Details"
4. Click "Export Private Key"
5. Enter password
6. Copy the private key (starts with `0x`)

**⚠️ SECURITY**: Never share or commit this key!

---

## 🔨 **Step 2: Compile Contracts** (1 minute)

```bash
cd packages/contracts

# Install dependencies (if not done)
bun install

# Compile contracts
bun run compile

# Expected output:
# ✓ Compiled 5 Solidity files successfully
```

---

## 🚀 **Step 3: Deploy to Amoy** (5-10 minutes)

```bash
# Make sure you're in packages/contracts
cd packages/contracts

# Deploy!
bun run deploy:amoy

# You'll see:
# 🚀 Starting Sephar Studios tokenomics deployment...
# Deploying contracts with account: 0xYourAddress
# Account balance: 100000000000000000 (0.1 MATIC)
#
# Deploying StudioToken...
# ✅ StudioToken deployed to: 0xABC123...
#
# Deploying MockUSDC...
# ✅ MockUSDC deployed to: 0xDEF456...
#
# Deploying SepharSubscription...
# ✅ SepharSubscription deployed to: 0xGHI789...
#
# Deploying CreatorPayments...
# ✅ CreatorPayments deployed to: 0xJKL012...
#
# Deploying TokenAMM...
# ✅ TokenAMM deployed to: 0xMNO345...
#
# 🎉 Deployment complete!
```

**⚠️ IMPORTANT**: Copy all these addresses! You'll need them next.

---

## 📝 **Step 4: Save Contract Addresses** (2 minutes)

After deployment, you'll see addresses like:
```
StudioToken: 0xABC123...
MockUSDC: 0xDEF456...
SepharSubscription: 0xGHI789...
CreatorPayments: 0xJKL012...
TokenAMM: 0xMNO345...
```

**Update root `.env` file:**
```bash
# Open c:\Users\Mayowa Animasaun\Documents\Projects\sepharstudios\.env
# Update these lines:

PUBLIC_STC_TOKEN_AMOY=0xYourStudioTokenAddress
PUBLIC_SUBSCRIPTION_NFT_AMOY=0xYourSepharSubscriptionAddress
PUBLIC_CREATOR_PAYMENTS_AMOY=0xYourCreatorPaymentsAddress
PUBLIC_TOKEN_AMM_AMOY=0xYourTokenAMMAddress
```

---

## ✅ **Step 5: Verify on Polygonscan** (Optional, 5 minutes)

```bash
# Verify contracts (makes them readable on explorer)
bun run verify:amoy <CONTRACT_ADDRESS>

# Example:
bun run verify:amoy 0xYourStudioTokenAddress

# Repeat for each contract
```

View your contracts at: https://amoy.polygonscan.com/

---

## 🧪 **Step 6: Test Deployment** (5 minutes)

```bash
# From root directory
cd ../..

# Install dependencies
bun install

# Start dev server
bun run dev

# Open browser
open http://localhost:5173/wallet
```

**Test checklist:**
- [ ] Navigate to `/wallet`
- [ ] Click "Connect Wallet"
- [ ] MetaMask opens
- [ ] Switch to Amoy network
- [ ] Wallet connects successfully
- [ ] Shows your wallet address
- [ ] Shows 0 STC balance (normal for new deployment)
- [ ] Navigate to `/tokens`
- [ ] Token dashboard loads without errors
- [ ] Navigate to `/subscription`
- [ ] NFT subscription page loads
- [ ] Shows subscription tiers

---

## 🐛 **Troubleshooting**

### "Insufficient funds"
- **Solution**: Need more MATIC. Visit faucet again: https://faucet.polygon.technology/

### "Network not found"
- **Solution**: Check `packages/contracts/.env` has `AMOY_RPC_URL`

### "Cannot find module"
- **Solution**: Run `bun install` in `packages/contracts`

### "Unknown network 'amoy'"
- **Solution**: Hardhat config should have Amoy (chain ID 80002) - already updated ✅

### "Private key not provided"
- **Solution**: Add `PRIVATE_KEY` to `packages/contracts/.env`

---

## 📊 **Gas Costs Estimate**

| Contract | Gas Used | Cost (MATIC) |
|----------|----------|--------------|
| StudioToken | ~2.5M | ~0.015 |
| MockUSDC | ~1.5M | ~0.010 |
| SepharSubscription | ~3.0M | ~0.020 |
| CreatorPayments | ~2.0M | ~0.015 |
| TokenAMM | ~2.5M | ~0.015 |
| **Total** | **~11.5M** | **~0.075 MATIC** |

**You have**: 0.1 MATIC ✅ (enough!)

---

## 🎉 **After Deployment**

Once contracts are deployed and addresses added to `.env`:

1. **Build production Docker image**:
```bash
docker build -f Dockerfile.web3 -t manimasaun/sepharstudios:latest .
```

2. **Push to registry**:
```bash
docker push manimasaun/sepharstudios:latest
```

3. **Deploy to Dokploy**:
   - Update environment variables with contract addresses
   - Deploy!

4. **Test production**:
   - Visit https://sepharstudios.com/wallet
   - Connect wallet
   - Test Web3 features

---

## 🔗 **Useful Links**

- **Amoy Faucet**: https://faucet.polygon.technology/
- **Amoy Explorer**: https://amoy.polygonscan.com/
- **Your RPC**: Already configured via Alchemy ✅
- **WalletConnect**: Already configured ✅

---

## 📝 **Quick Command Reference**

```bash
# Navigate to contracts
cd packages/contracts

# Compile
bun run compile

# Deploy
bun run deploy:amoy

# Verify (optional)
bun run verify:amoy <ADDRESS>

# Test locally
cd ../.. && bun run dev
```

---

**Ready?** Start with Step 1 - Add your private key to `packages/contracts/.env`! 🚀

**Estimated time**: 15 minutes
**Cost**: ~0.075 MATIC (you have 0.1) ✅
