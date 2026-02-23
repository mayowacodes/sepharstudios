# Sephar Studios - Production Deployment Guide

## 🎯 Deployment to Docker & Dokploy

This guide covers everything needed to deploy Sephar Studios to production using Docker and Dokploy.

---

## 📋 Pre-Deployment Checklist

### ✅ Required Services
- [x] PostgreSQL Database (External: `213.136.92.11:6060`)
- [ ] MinIO Storage (Containerized or External)
- [ ] Smart Contracts Deployed (Polygon/Mumbai)
- [ ] Domain DNS Configured
- [ ] SSL Certificates (via Traefik/Let's Encrypt)

---

## 🔑 Environment Variables Needed

### 1. **Server Configuration**
```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
ORIGIN=https://sepharstudios.com
BODY_SIZE_LIMIT=10485760  # 10MB
```

### 2. **Database (PostgreSQL + Drizzle ORM)** ✅ CONFIGURED
```bash

```

### 3. **Authentication (Better Auth)** ✅ CONFIGURED
```bash

BETTER_AUTH_URL=https://sepharstudios.com
BETTER_API_URL=https://sepharstudios.com/api/auth
PUBLIC_BETTER_AUTH_URL=https://sepharstudios.com
```

### 4. **OAuth Providers** ✅ CONFIGURED
```bash
# Google OAuth

REDIRECT_URI=https://sepharstudios.com/api/auth/callback/google

# Optional: Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key
```

### 5. **Storage (MinIO)** ⚠️ PARTIALLY CONFIGURED
```bash
# MinIO Credentials (Change in production!)
MINIO_ROOT_USER=minioadmin_CHANGE_ME
MINIO_ROOT_PASSWORD=minioadmin123_CHANGE_ME_STRONG_PASSWORD

# MinIO Configuration
MINIO_ENDPOINT=minio  # Docker service name (or external IP)
MINIO_PORT=9000
MINIO_USE_SSL=false   # Set to true if using SSL
MINIO_ACCESS_KEY=${MINIO_ROOT_USER}
MINIO_SECRET_KEY=${MINIO_ROOT_PASSWORD}
MINIO_BUCKET=sephar-uploads

# Public URLs (for video streaming)
MINIO_PUBLIC_URL=https://s3.sepharstudios.com
```

### 6. **Web3 / Blockchain** ❌ NOT CONFIGURED
```bash
# WalletConnect Project ID (Get from https://cloud.walletconnect.com/)
PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Smart Contract Addresses (After deployment)
# Polygon Mainnet
PUBLIC_STC_TOKEN_POLYGON=0xYourTokenAddress
PUBLIC_SUBSCRIPTION_NFT_POLYGON=0xYourSubscriptionAddress
PUBLIC_CREATOR_PAYMENTS_POLYGON=0xYourCreatorPaymentsAddress
PUBLIC_TOKEN_AMM_POLYGON=0xYourAMMAddress

# Mumbai Testnet (for testing)
PUBLIC_STC_TOKEN_MUMBAI=0xYourTokenAddress
PUBLIC_SUBSCRIPTION_NFT_MUMBAI=0xYourSubscriptionAddress
PUBLIC_CREATOR_PAYMENTS_MUMBAI=0xYourCreatorPaymentsAddress
PUBLIC_TOKEN_AMM_MUMBAI=0xYourAMMAddress

# Blockchain RPC URLs (Optional - uses public RPCs by default)
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### 7. **Email/Webhooks** ❌ NOT CONFIGURED
```bash
# Email Webhook (for notifications)
EMAIL_WEBHOOK=https://your-email-service.com/webhook

# Optional: SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@sepharstudios.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=Sephar Studios <noreply@sepharstudios.com>
```

### 8. **Analytics & Monitoring** (Optional)
```bash
# Google Analytics
PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn.com

# PostHog Analytics
PUBLIC_POSTHOG_KEY=your_posthog_key
PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 9. **Content Moderation** (Optional)
```bash
# AI Content Moderation
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

---

## 🚀 Deployment Steps

### **Step 1: Get Required API Keys**

#### 1.1 WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the **Project ID**
4. Add to `.env`: `PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id`

#### 1.2 Email Service
Choose one:
- **Resend**: https://resend.com/
- **SendGrid**: https://sendgrid.com/
- **Mailgun**: https://www.mailgun.com/

#### 1.3 MinIO Credentials (Production)
```bash
# Generate strong credentials
MINIO_ROOT_USER=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 20)
MINIO_ROOT_PASSWORD=$(openssl rand -base64 48)
```

---

### **Step 2: Deploy Smart Contracts**

#### 2.1 Setup Contracts Environment
```bash
cd packages/contracts

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_deployer_wallet_private_key
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key
EOF
```

#### 2.2 Get Testnet MATIC
- Visit [Mumbai Faucet](https://faucet.polygon.technology/)
- Request testnet MATIC for your deployer wallet

#### 2.3 Deploy to Mumbai (Testnet)
```bash
cd packages/contracts

# Compile contracts
bun run compile

# Deploy to Mumbai testnet
bun run deploy:mumbai

# Save the contract addresses output!
```

#### 2.4 Deploy to Polygon (Mainnet) - Later
```bash
# ONLY after testing on Mumbai!
bun run deploy:polygon
```

#### 2.5 Update Web3 Config
Edit `packages/web3/src/lib/config.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  [polygonMumbai.id]: {
    studioToken: '0xYourDeployedTokenAddress',
    sepharSubscription: '0xYourDeployedSubscriptionAddress',
    creatorPayments: '0xYourDeployedCreatorPaymentsAddress',
    tokenAMM: '0xYourDeployedAMMAddress',
    usdcToken: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'
  }
}
```

---

### **Step 3: Configure MinIO Storage**

#### 3.1 Update MinIO Credentials
Edit `docker-compose.yml`:
```yaml
environment:
  MINIO_ROOT_USER: ${MINIO_ROOT_USER}  # From .env
  MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}  # From .env
```

#### 3.2 Create MinIO Bucket
After deployment:
```bash
# Access MinIO Console
open https://minio.sepharstudios.com

# Login with MINIO_ROOT_USER/PASSWORD
# Create bucket: sephar-uploads
# Set bucket policy to public-read for videos
```

---

### **Step 4: Update Dockerfile for Monorepo**

Current Dockerfile needs updating for the new structure:

```dockerfile
# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy workspace files
COPY bun.lock package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/web3/package.json ./packages/web3/
COPY packages/shared/package.json ./packages/shared/
COPY packages/contracts/package.json ./packages/contracts/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the web app
WORKDIR /app/apps/web
RUN bun run build

# Stage 2: Production
FROM oven/bun:1-slim
WORKDIR /app

# Copy built app
COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "build/index.js"]
```

---

### **Step 5: Build & Push Docker Image**

```bash
# Build image
docker build -t manimasaun/sepharstudios:latest .

# Test locally
docker run -p 3000:3000 --env-file .env manimasaun/sepharstudios:latest

# Push to registry
docker push manimasaun/sepharstudios:latest
```

---

### **Step 6: Deploy to Dokploy**

#### 6.1 Create `.env.production` File
```bash
# Copy all environment variables here
# This will be loaded by Dokploy
```

#### 6.2 Deploy via Dokploy Dashboard
1. Login to Dokploy
2. Create new project: **Sephar Studios**
3. Add service: **Docker Compose**
4. Upload `docker-compose.yml`
5. Add environment variables from `.env.production`
6. Deploy!

#### 6.3 DNS Configuration
Add DNS records:
```
A     sepharstudios.com          → Your_Server_IP
CNAME www.sepharstudios.com     → sepharstudios.com
CNAME minio.sepharstudios.com   → sepharstudios.com
CNAME s3.sepharstudios.com      → sepharstudios.com
```

---

### **Step 7: Database Migration**

```bash
# SSH into server or run locally
cd /app

# Run migrations
bun run drizzle-generate
bun run drizzle-migrate

# Verify tables created
bun run drizzle-studio
```

---

### **Step 8: Post-Deployment Verification**

```bash
# Test main site
curl -I https://sepharstudios.com

# Test API
curl https://sepharstudios.com/api/auth

# Test MinIO
curl -I https://s3.sepharstudios.com

# Test health check
curl https://sepharstudios.com/health
```

---

## 🔒 Security Checklist

- [ ] Change default MinIO credentials
- [ ] Rotate `BETTER_AUTH_SECRET` (use 32+ char random string)
- [ ] Enable SSL for MinIO (`MINIO_USE_SSL=true`)
- [ ] Set secure CORS policies
- [ ] Enable rate limiting on API endpoints
- [ ] Configure firewall rules (only 80, 443, 9000, 9001)
- [ ] Enable Docker secrets instead of env vars
- [ ] Setup monitoring & alerts
- [ ] Configure automated backups (PostgreSQL + MinIO)
- [ ] Review OAuth redirect URIs

---

## 📊 Monitoring & Maintenance

### Logs
```bash
# View app logs
docker logs -f sepharstudios

# View MinIO logs
docker logs -f sephar-minio
```

### Backups
```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > sephar_backup_$(date +%Y%m%d).sql

# Backup MinIO
mc mirror minio/sephar-uploads /backups/minio/
```

---

## 🐛 Troubleshooting

### Issue: Web3 features not working
- Verify `PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check contract addresses in `packages/web3/src/lib/config.ts`
- Ensure user is on correct network (Polygon/Mumbai)

### Issue: Videos not loading
- Check MinIO is running: `docker ps | grep minio`
- Verify bucket exists and has public-read policy
- Check `MINIO_PUBLIC_URL` is correct

### Issue: Auth not working
- Verify `BETTER_AUTH_URL` matches production domain
- Check OAuth redirect URIs in Google Console
- Ensure `BETTER_AUTH_SECRET` is set

---

## 📝 Next Steps After Deployment

1. **Test all features**:
   - [ ] User registration/login
   - [ ] Video streaming
   - [ ] Content upload (Creator portal)
   - [ ] Admin review system
   - [ ] Wallet connection
   - [ ] Token purchase
   - [ ] NFT subscription

2. **Setup monitoring**:
   - [ ] Setup Sentry for error tracking
   - [ ] Configure uptime monitoring
   - [ ] Setup Google Analytics

3. **Performance optimization**:
   - [ ] Enable CDN for static assets
   - [ ] Configure caching headers
   - [ ] Setup Redis for session storage

4. **Marketing**:
   - [ ] Submit sitemap to Google
   - [ ] Setup social media meta tags
   - [ ] Create launch announcement

---

## 🎉 Launch Checklist

- [ ] All environment variables configured
- [ ] Smart contracts deployed & verified
- [ ] DNS records configured
- [ ] SSL certificates active
- [ ] Database migrated
- [ ] MinIO storage configured
- [ ] Test accounts created
- [ ] Sample content uploaded
- [ ] All features tested
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Launch announcement ready

---

**Estimated Deployment Time**: 2-3 hours
**Difficulty**: Intermediate
**Cost Estimate**: $10-50/month (Dokploy + Database + Storage)

Good luck with your launch! 🚀🎬
