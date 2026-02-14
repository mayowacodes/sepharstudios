# 🚀 Sephar Studios - Quick Deployment Checklist

## ⚡ Immediate Actions Required

### 1️⃣ **Get API Keys** (30 minutes)

#### WalletConnect Project ID ❌ REQUIRED
- [ ] Go to https://cloud.walletconnect.com/
- [ ] Sign up/Login
- [ ] Create project: "Sephar Studios"
- [ ] Copy Project ID
- [ ] Add to `.env`: `PUBLIC_WALLETCONNECT_PROJECT_ID=xxx`

#### Email Service ❌ REQUIRED
Choose one and get API key:
- [ ] **Resend** (Recommended): https://resend.com/ (Free tier: 3k emails/month)
- [ ] **SendGrid**: https://sendgrid.com/ (Free tier: 100 emails/day)
- [ ] **Mailgun**: https://mailgun.com/

Add to `.env`:
```bash
EMAIL_WEBHOOK=https://api.resend.com/webhooks/xxx
```

### 2️⃣ **Update MinIO Credentials** (5 minutes)

#### Generate Strong Credentials ❌ REQUIRED
```bash
# Generate random credentials
MINIO_USER=$(openssl rand -base64 20 | tr -dc 'a-zA-Z0-9' | head -c 16)
MINIO_PASS=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 32)

echo "MINIO_ROOT_USER=$MINIO_USER"
echo "MINIO_ROOT_PASSWORD=$MINIO_PASS"
```

Update in `.env`:
```bash
MINIO_ROOT_USER=your_generated_user
MINIO_ROOT_PASSWORD=your_generated_strong_password
```

### 3️⃣ **Deploy Smart Contracts** (1 hour)

#### Get Testnet MATIC ❌ REQUIRED
- [ ] Visit https://faucet.polygon.technology/
- [ ] Connect wallet
- [ ] Request Mumbai testnet MATIC
- [ ] Wait for confirmation

#### Deploy Contracts ❌ REQUIRED
```bash
cd packages/contracts

# Create .env
cat > .env << EOF
PRIVATE_KEY=your_wallet_private_key
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key
EOF

# Compile
bun run compile

# Deploy to Mumbai
bun run deploy:mumbai
```

#### Save Contract Addresses ❌ REQUIRED
After deployment, you'll see:
```
✅ StudioToken deployed: 0xABC123...
✅ SepharSubscription deployed: 0xDEF456...
✅ CreatorPayments deployed: 0xGHI789...
✅ TokenAMM deployed: 0xJKL012...
```

Update `packages/web3/src/lib/config.ts`:
```typescript
[polygonMumbai.id]: {
  studioToken: '0xABC123...',
  sepharSubscription: '0xDEF456...',
  creatorPayments: '0xGHI789...',
  tokenAMM: '0xJKL012...',
  usdcToken: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'
}
```

### 4️⃣ **Update Dockerfile** (10 minutes)

Current Dockerfile doesn't support monorepo. Update it:

```dockerfile
# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy workspace
COPY bun.lock package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/web3/package.json ./packages/web3/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy all source
COPY . .

# Build web app
WORKDIR /app/apps/web
RUN bun run build

# Stage 2: Production
FROM oven/bun:1-slim
WORKDIR /app

COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["bun", "run", "build/index.js"]
```

### 5️⃣ **Install Dependencies & Build** (5 minutes)

```bash
# Install all workspace dependencies
bun install

# Build web app
cd apps/web
bun run build

# Test locally
bun run preview
```

### 6️⃣ **Build Docker Image** (10 minutes)

```bash
# Build
docker build -t manimasaun/sepharstudios:latest .

# Test locally
docker run -p 3000:3000 --env-file .env manimasaun/sepharstudios:latest

# Push to Docker Hub
docker login
docker push manimasaun/sepharstudios:latest
```

### 7️⃣ **Configure DNS** (15 minutes)

Add these DNS records:
```
Type    Name                       Value
----    ----                       -----
A       sepharstudios.com         Your_Server_IP
CNAME   www.sepharstudios.com     sepharstudios.com
CNAME   minio.sepharstudios.com   sepharstudios.com
CNAME   s3.sepharstudios.com      sepharstudios.com
```

### 8️⃣ **Deploy to Dokploy** (20 minutes)

1. [ ] Login to Dokploy dashboard
2. [ ] Create new project: "Sephar Studios"
3. [ ] Add Docker Compose service
4. [ ] Upload `docker-compose.yml`
5. [ ] Add environment variables (copy from `.env.example`)
6. [ ] Click **Deploy**
7. [ ] Wait for deployment
8. [ ] Check logs for errors

### 9️⃣ **Run Database Migrations** (5 minutes)

```bash
# SSH into Dokploy server OR run locally pointing to prod DB

# Generate migration
bun run drizzle-generate

# Apply migration
bun run drizzle-migrate

# Verify
bun run drizzle-studio
```

### 🔟 **Post-Deployment Tests** (10 minutes)

```bash
# Test main site
curl -I https://sepharstudios.com
# Expected: 200 OK

# Test API
curl https://sepharstudios.com/api/auth
# Expected: Auth endpoints response

# Test MinIO
curl -I https://s3.sepharstudios.com
# Expected: 200 OK

# Test wallet connection
open https://sepharstudios.com/wallet
# Should show wallet connect UI
```

---

## 📊 Status Summary

| Component | Status | Action Required |
|-----------|--------|----------------|
| Database | ✅ Configured | Ready |
| Authentication | ✅ Configured | Ready |
| OAuth | ✅ Configured | Ready |
| MinIO Storage | ⚠️ Default Creds | **Update password!** |
| WalletConnect | ❌ Not Set | **Get Project ID** |
| Smart Contracts | ❌ Not Deployed | **Deploy to Mumbai** |
| Email Service | ❌ Not Set | **Choose provider** |
| Docker Image | ⚠️ Old Version | **Update Dockerfile** |
| DNS | ❓ Unknown | **Configure** |

---

## ⏱️ Time Estimate

| Task | Time | Difficulty |
|------|------|-----------|
| Get API Keys | 30 min | Easy |
| Update MinIO | 5 min | Easy |
| Deploy Contracts | 1 hour | Medium |
| Update Dockerfile | 10 min | Easy |
| Build & Test | 15 min | Easy |
| Deploy to Dokploy | 20 min | Easy |
| DNS Config | 15 min | Easy |
| Database Migrations | 5 min | Easy |
| Testing | 10 min | Easy |
| **Total** | **~2.5 hours** | **Medium** |

---

## 🆘 Priority Order

### 🔴 **Critical (Do First)**
1. Update MinIO credentials
2. Get WalletConnect Project ID
3. Deploy smart contracts to Mumbai
4. Update Dockerfile for monorepo

### 🟡 **Important (Do Soon)**
5. Choose & configure email service
6. Build & push Docker image
7. Configure DNS records
8. Deploy to Dokploy

### 🟢 **Optional (Do Later)**
9. Setup monitoring (Sentry)
10. Configure analytics (GA4)
11. Setup backups
12. Deploy to Polygon mainnet

---

## 📝 Commands Quick Reference

```bash
# Install dependencies
bun install

# Deploy contracts
cd packages/contracts && bun run deploy:mumbai

# Build Docker image
docker build -t manimasaun/sepharstudios:latest .

# Run migrations
bun run drizzle-migrate

# Test locally
bun run dev
```

---

## 🔗 Important Links

- **WalletConnect Cloud**: https://cloud.walletconnect.com/
- **Mumbai Faucet**: https://faucet.polygon.technology/
- **Polygonscan (Mumbai)**: https://mumbai.polygonscan.com/
- **Resend (Email)**: https://resend.com/
- **Docker Hub**: https://hub.docker.com/
- **Full Guide**: See `DEPLOYMENT_GUIDE.md`

---

**Ready to deploy? Start with Critical tasks above!** 🚀