# 🪙 STC Token Visibility & Distribution Guide

## 📋 Token Basics (From Contract)

**StudioChain Token (STC)**
- **Symbol**: STC
- **Name**: StudioChain Token
- **Decimals**: 18
- **Total Supply**: 1,000,000,000 STC (1 billion)
- **Standard**: ERC-20 (compatible with all wallets)

## 🚀 What Happens When You Deploy

### ✅ **Contract Deployment**
```bash
npm run deploy:mumbai  # Testnet first
npm run deploy:polygon # Mainnet
```

**Result**:
- STC contract goes live on blockchain
- Contract address generated (e.g., `0x123...abc`)
- 1 billion tokens created and distributed

### 📊 **Token Distribution (Automatic)**
```
📊 1 Billion STC Total Supply:

🎯 User Rewards Pool     → 400M STC (40%)
👨‍🎨 Creator Incentives    → 300M STC (30%)
🏗️ Platform Development  → 200M STC (20%)
🏛️ Community Governance  → 100M STC (10%)
```

## 👀 **How Users See Tokens in Wallets**

### **Method 1: Automatic Detection (Rare for New Tokens)**
- Popular tokens appear automatically
- Takes time for new tokens to be indexed
- May not work initially

### **Method 2: Manual Addition (Most Common)**
Users need:
1. **Contract Address**: `0x[deployed-address]`
2. **Token Symbol**: `STC`
3. **Decimals**: `18`

### **Method 3: One-Click Addition (Best UX)**
Your app provides "Add to Wallet" button:
```javascript
window.ethereum.request({
  method: 'wallet_watchAsset',
  params: {
    type: 'ERC20',
    options: {
      address: contractAddress,
      symbol: 'STC',
      decimals: 18,
    },
  },
});
```

## 💰 **How Users Get STC Tokens**

### **1. Earning Through Platform**
```solidity
// Built into your contract
uint256 public viewingRewardRate = 5 * 10**18; // 5 STC/hour
uint256 public referralReward = 100 * 10**18;  // 100 STC/referral
uint256 public dailyUserRewardLimit = 50 * 10**18; // 50 STC/day max
```

**Actions that earn STC:**
- ✅ Watching content: 5 STC/hour
- ✅ Referring friends: 100 STC/referral
- ✅ Rating/reviewing: Variable rewards
- ✅ Daily login bonuses: Up to 50 STC/day

### **2. Buying Through AMM**
- Users swap USDC → STC via your built-in AMM
- Provides instant liquidity
- Price discovery through trading

### **3. Staking Rewards**
- Stake STC → Get subscription discounts
- Earn additional STC as staking rewards
- Lock periods = higher rewards

## 🔧 **Technical Implementation Steps**

### **Step 1: Deploy Contracts**
```bash
cd contracts
npm run deploy:mumbai   # Test first
npm run deploy:polygon  # Then mainnet
```

### **Step 2: Update Frontend Config**
Copy deployed addresses to `.env`:
```env
PUBLIC_STC_TOKEN_POLYGON=0x[deployed-address]
PUBLIC_SUBSCRIPTION_NFT_POLYGON=0x[deployed-address]
PUBLIC_TOKEN_AMM_POLYGON=0x[deployed-address]
```

### **Step 3: Initialize Token Distribution**
```solidity
// Contract automatically distributes to pools on deployment
// Platform treasury gets allocation for rewards
// AMM gets initial liquidity
```

### **Step 4: Add Token to Wallet UX**
Include `AddTokenToWallet.svelte` component on:
- `/tokens` page
- After user earns first tokens
- In wallet connection flow

## 🎯 **User Journey: From Zero to STC**

### **New User Flow:**
1. **Connect Wallet** → See 0 STC balance
2. **Complete Actions** → Earn first STC tokens
3. **Add Token** → Click "Add STC to Wallet" button
4. **See Balance** → Tokens appear in MetaMask
5. **Use Tokens** → Stake for discounts or governance

### **Returning User Flow:**
1. **Connect Wallet** → Automatically see STC balance
2. **Continue Earning** → Through platform engagement
3. **Spend/Stake** → Use tokens for benefits

## 🔍 **Verification & Visibility**

### **Contract Verification**
After deployment:
1. Verify on PolygonScan
2. Submit to token lists (CoinGecko, etc.)
3. Add to DEX aggregators

### **Wallet Support**
- ✅ MetaMask: Full support
- ✅ WalletConnect: All compatible wallets
- ✅ Coinbase Wallet: Full support
- ✅ Trust Wallet: Full support

### **Block Explorer**
- **Polygon**: https://polygonscan.com/token/[address]
- **Mumbai**: https://mumbai.polygonscan.com/token/[address]

## 📱 **Platform Integration Points**

### **Where to Show "Add Token" Button:**
1. **First-time token earn** → Auto-prompt
2. **Tokens page** → Prominent button
3. **Wallet connection** → During setup
4. **After subscription purchase** → When relevant

### **Token Balance Display:**
```svelte
<!-- Show in header -->
<div class="token-balance">
  {userBalance} STC
</div>

<!-- Show in wallet component -->
<WalletConnect />
<!-- Automatically shows STC balance -->
```

## 🎉 **Success Indicators**

**Token is "Alive" When:**
- ✅ Contract deployed successfully
- ✅ Users can see balance in wallets
- ✅ Transfers work between addresses
- ✅ AMM allows USDC ↔ STC swaps
- ✅ Staking functions work
- ✅ Reward distribution works

## 🚨 **Common Issues & Solutions**

### **"Token Not Showing"**
- Check network (Polygon vs Mumbai)
- Verify contract address
- Use manual addition method
- Check if user has any balance

### **"Wrong Balance"**
- Ensure wallet on correct network
- Refresh wallet/clear cache
- Verify contract interaction

### **"Can't Add Token"**
- Try manual addition
- Check if wallet supports ERC-20
- Verify contract deployment

## 🔄 **Testing Flow**

### **Mumbai Testnet:**
1. Deploy to Mumbai
2. Get testnet MATIC from faucet
3. Test token earning/distribution
4. Verify wallet visibility
5. Test all functions

### **Polygon Mainnet:**
1. Deploy with real MATIC
2. Add initial liquidity to AMM
3. Test with small amounts first
4. Monitor contract interactions

---

**✨ Bottom Line**: Once deployed, STC tokens are real ERC-20 tokens that work with any Ethereum-compatible wallet. Users earn them through platform activity, can trade them via your AMM, and use them for subscription discounts and governance!