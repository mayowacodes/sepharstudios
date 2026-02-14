# StudioChain Video Infrastructure: Contabo + Supabase Architecture

## Overview

StudioChain implements a **cost-effective, scalable video hosting solution** using Contabo VPS servers for video processing and delivery, combined with Supabase for metadata storage and authentication. This approach provides **75% cost savings** compared to traditional AWS-based solutions while maintaining high performance and reliability.

## Architecture Overview

### Core Components
```
Video Infrastructure Stack:
├── Contabo VPS Servers (Video processing & delivery)
├── Supabase (Database, storage, authentication)
├── Smart Contract Access Control (Blockchain integration)
├── Custom Video Pipeline (FFmpeg-based encoding)
└── Global CDN Distribution (Multi-region Contabo servers)
```

### Cost Comparison Analysis

**Traditional AWS Approach:**
```
Monthly Infrastructure Costs (1TB content + moderate traffic):
├── S3 Storage: $23/month
├── CloudFront Bandwidth: $85/month
├── MediaConvert Encoding: $50/month
├── Additional AWS services: $40/month
└── Total: ~$198/month
```

**StudioChain Contabo + Supabase Approach:**
```
Monthly Infrastructure Costs (same scale):
├── Contabo VPS (8GB RAM, 200GB SSD): €20 (~$22/month)
├── Supabase Pro Plan: $25/month
├── Supabase Storage (1TB): $21/month
├── Additional bandwidth: €10 (~$11/month)
├── SSL certificates & monitoring: $5/month
└── Total: ~$84/month (58% cost savings)
```

## Contabo Server Configuration

### Server Specifications

**Primary Video Server (Germany):**
```
Contabo VPS L Configuration:
├── CPU: 8 vCPU cores
├── RAM: 16GB DDR4
├── Storage: 400GB NVMe SSD
├── Bandwidth: Unlimited at 1 Gbit/s
├── Location: Nuremberg, Germany (EU compliance)
├── Cost: €24.99/month (~$27)
└── Additional IPs: €1/month each
```

**Global Distribution Setup:**
```
Multi-Region Architecture:
├── EU Server (Germany): Primary encoding & EU users
├── US Server (St. Louis): American users
├── Asia Server: Asian/Pacific users
├── Load balancing: DNS-based routing
└── Total cost: ~$75/month for 3 regions
```

### Server Software Stack

**Operating System & Core Services:**
```bash
# Ubuntu 22.04 LTS setup
apt update && apt upgrade -y

# Essential packages
apt install -y nginx ffmpeg nodejs npm python3 python3-pip
apt install -y postgresql-client redis-server supervisor

# Video processing tools
apt install -y x264 x265 libvpx-dev libopus-dev

# Monitoring & security
apt install -y ufw fail2ban htop iotop
```

**Nginx Configuration for Video Streaming:**
```nginx
# /etc/nginx/sites-available/studiochain
server {
    listen 80;
    server_name stream.studiochain.com;

    # Video file serving
    location /videos/ {
        alias /var/www/studiochain/videos/;

        # Enable range requests for video seeking
        add_header Accept-Ranges bytes;

        # CORS headers for cross-origin requests
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";

        # Cache headers for video content
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HLS streaming endpoint
    location /hls/ {
        alias /var/www/studiochain/hls/;

        # HLS-specific headers
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Content-Type "application/x-mpegURL";
    }

    # API endpoints
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Supabase Integration Architecture

### Database Schema

**Content Management Tables:**
```sql
-- Main content table
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    storage_path TEXT NOT NULL,
    streaming_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER, -- seconds
    file_size BIGINT, -- bytes
    resolution TEXT DEFAULT '1080p',
    bitrate INTEGER, -- kbps
    codec TEXT DEFAULT 'h264',
    status TEXT DEFAULT 'uploading', -- uploading, encoding, ready, failed
    nft_token_id INTEGER,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content access tracking
CREATE TABLE content_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    user_wallet TEXT NOT NULL,
    access_method TEXT NOT NULL, -- subscription, nft, stc_payment
    session_duration INTEGER, -- seconds
    bytes_transferred BIGINT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator analytics and revenue
CREATE TABLE content_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_views INTEGER DEFAULT 0,
    unique_viewers INTEGER DEFAULT 0,
    total_watch_time INTEGER DEFAULT 0, -- seconds
    revenue_generated DECIMAL(12,2) DEFAULT 0,
    bandwidth_used BIGINT DEFAULT 0, -- bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(content_id, date)
);

-- Creator payment preferences
CREATE TABLE creator_payment_settings (
    creator_id UUID PRIMARY KEY,
    payment_method TEXT NOT NULL DEFAULT 'fiat', -- fiat, usdc, stc, mixed
    fiat_percentage INTEGER DEFAULT 100 CHECK (fiat_percentage >= 0 AND fiat_percentage <= 100),
    usdc_percentage INTEGER DEFAULT 0 CHECK (usdc_percentage >= 0 AND usdc_percentage <= 100),
    stc_percentage INTEGER DEFAULT 0 CHECK (stc_percentage >= 0 AND stc_percentage <= 100),
    wallet_address TEXT,
    bank_details JSONB,
    auto_convert_stc_to_fiat BOOLEAN DEFAULT false,
    minimum_payout_amount DECIMAL(10,2) DEFAULT 10.00,
    payout_frequency TEXT DEFAULT 'monthly', -- weekly, monthly, quarterly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CHECK (fiat_percentage + usdc_percentage + stc_percentage = 100)
);
```

**Supabase Storage Buckets:**
```javascript
// Storage bucket configuration
const buckets = [
  {
    name: 'raw-uploads',
    public: false,
    fileSize: '5GB', // Max file size
    allowedMimeTypes: ['video/mp4', 'video/mov', 'video/avi']
  },
  {
    name: 'processed-videos',
    public: false,
    fileSize: '10GB',
    allowedMimeTypes: ['application/x-mpegURL', 'video/MP2T'] // HLS files
  },
  {
    name: 'thumbnails',
    public: true,
    fileSize: '10MB',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
];
```

### Supabase Configuration

**Real-time Subscriptions:**
```javascript
// Real-time analytics for creators
const subscribeToAnalytics = (creatorId) => {
  return supabase
    .channel(`creator-analytics-${creatorId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'content_analytics',
      filter: `creator_id=eq.${creatorId}`
    }, (payload) => {
      // Update creator dashboard in real-time
      updateCreatorDashboard(payload.new);
    })
    .subscribe();
};

// Real-time content status updates
const subscribeToContentStatus = (contentId) => {
  return supabase
    .channel(`content-status-${contentId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'content',
      filter: `id=eq.${contentId}`
    }, (payload) => {
      // Notify user when encoding is complete
      if (payload.new.status === 'ready') {
        notifyContentReady(payload.new);
      }
    })
    .subscribe();
};
```

## Video Processing Pipeline

### Upload Workflow

**Step 1: Client-Side Upload**
```javascript
// Frontend upload component
const uploadVideo = async (file, metadata) => {
  // 1. Upload to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('raw-uploads')
    .upload(`${userId}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // 2. Create content record
  const { data: contentData, error: contentError } = await supabase
    .from('content')
    .insert({
      creator_id: userId,
      title: metadata.title,
      description: metadata.description,
      storage_path: uploadData.path,
      status: 'uploaded'
    })
    .select()
    .single();

  if (contentError) throw contentError;

  // 3. Trigger server-side processing
  await fetch('/api/process-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contentId: contentData.id,
      storagePath: uploadData.path
    })
  });

  return contentData;
};
```

**Step 2: Server-Side Processing**
```javascript
// API route: /api/process-video
app.post('/api/process-video', async (req, res) => {
  const { contentId, storagePath } = req.body;

  // Update status to processing
  await supabase
    .from('content')
    .update({ status: 'encoding' })
    .eq('id', contentId);

  // Add to processing queue
  await processVideoQueue.add('encode-video', {
    contentId,
    storagePath,
    outputFormats: ['720p', '1080p', 'hls']
  });

  res.json({ success: true, message: 'Video queued for processing' });
});
```

### Video Encoding Process

**FFmpeg Encoding Pipeline:**
```bash
#!/bin/bash
# Video processing script

INPUT_PATH=$1
OUTPUT_DIR=$2
CONTENT_ID=$3

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Generate thumbnail
ffmpeg -i "$INPUT_PATH" -ss 00:00:01.000 -vframes 1 \
  "$OUTPUT_DIR/thumbnail.jpg"

# Encode 720p version
ffmpeg -i "$INPUT_PATH" \
  -c:v libx264 -preset medium -crf 23 -maxrate 2M -bufsize 4M \
  -vf "scale=-2:720" \
  -c:a aac -b:a 128k \
  "$OUTPUT_DIR/720p.mp4"

# Encode 1080p version
ffmpeg -i "$INPUT_PATH" \
  -c:v libx264 -preset medium -crf 21 -maxrate 4M -bufsize 8M \
  -vf "scale=-2:1080" \
  -c:a aac -b:a 192k \
  "$OUTPUT_DIR/1080p.mp4"

# Generate HLS segments
ffmpeg -i "$INPUT_PATH" \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -hls_time 10 \
  -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/segment%03d.ts" \
  -master_pl_name "master.m3u8" \
  "$OUTPUT_DIR/playlist.m3u8"

# Upload processed files back to Supabase
upload_processed_files "$OUTPUT_DIR" "$CONTENT_ID"
```

**Processing Queue Management:**
```javascript
// Bull queue for video processing
const Queue = require('bull');
const processVideoQueue = new Queue('video processing');

processVideoQueue.process('encode-video', async (job) => {
  const { contentId, storagePath, outputFormats } = job.data;

  try {
    // Download file from Supabase
    const { data: fileData } = await supabase.storage
      .from('raw-uploads')
      .download(storagePath);

    // Process video using FFmpeg
    const outputPath = await processVideo(fileData, outputFormats);

    // Upload processed files
    const streamingUrls = await uploadProcessedFiles(outputPath, contentId);

    // Update content record
    await supabase
      .from('content')
      .update({
        status: 'ready',
        streaming_url: streamingUrls.hls,
        thumbnail_url: streamingUrls.thumbnail
      })
      .eq('id', contentId);

    return { success: true, contentId };
  } catch (error) {
    // Mark as failed
    await supabase
      .from('content')
      .update({ status: 'failed' })
      .eq('id', contentId);

    throw error;
  }
});
```

## Smart Contract Integration

### Content Access Control

**Blockchain-Gated Video Access:**
```javascript
// API middleware for content access verification
const verifyContentAccess = async (req, res, next) => {
  const { contentId } = req.params;
  const userWallet = req.headers['x-wallet-address'];

  if (!userWallet) {
    return res.status(401).json({ error: 'Wallet address required' });
  }

  try {
    // Check subscription NFT
    const hasSubscription = await verifySubscriptionNFT(userWallet);

    // Check content-specific NFT
    const hasContentNFT = await verifyContentNFT(userWallet, contentId);

    // Check if content requires premium access
    const { data: content } = await supabase
      .from('content')
      .select('is_premium, nft_token_id')
      .eq('id', contentId)
      .single();

    if (content.is_premium && !hasSubscription && !hasContentNFT) {
      return res.status(403).json({
        error: 'Premium content requires subscription NFT or content NFT',
        requiresNFT: true,
        contentNFTId: content.nft_token_id
      });
    }

    // Log access for analytics
    await logContentAccess(contentId, userWallet, hasSubscription ? 'subscription' : 'nft');

    next();
  } catch (error) {
    res.status(500).json({ error: 'Access verification failed' });
  }
};

// Protected video streaming endpoint
app.get('/api/stream/:contentId', verifyContentAccess, async (req, res) => {
  const { contentId } = req.params;

  // Get streaming URL from database
  const { data: content } = await supabase
    .from('content')
    .select('streaming_url, title')
    .eq('id', contentId)
    .single();

  if (!content.streaming_url) {
    return res.status(404).json({ error: 'Content not found or not ready' });
  }

  // Generate time-limited signed URL
  const signedUrl = await generateSignedURL(content.streaming_url, 3600); // 1 hour

  res.json({
    streamUrl: signedUrl,
    title: content.title,
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
  });
});
```

### Revenue Distribution Integration

**Automated Creator Payouts:**
```javascript
// Daily revenue calculation and distribution
const distributeCreatorRevenue = async () => {
  // Get yesterday's analytics
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: analytics } = await supabase
    .from('content_analytics')
    .select(`
      content_id,
      revenue_generated,
      content!inner(creator_id)
    `)
    .eq('date', yesterday);

  for (const entry of analytics) {
    const creatorRevenue = entry.revenue_generated * 0.30; // 30% to creator

    // Get creator payment preferences
    const { data: paymentSettings } = await supabase
      .from('creator_payment_settings')
      .select('*')
      .eq('creator_id', entry.content.creator_id)
      .single();

    // Calculate payment breakdown
    const payments = {
      fiat: creatorRevenue * (paymentSettings.fiat_percentage / 100),
      usdc: creatorRevenue * (paymentSettings.usdc_percentage / 100),
      stc: creatorRevenue * (paymentSettings.stc_percentage / 100)
    };

    // Queue payments
    if (payments.fiat > 0) await queueFiatPayment(entry.content.creator_id, payments.fiat);
    if (payments.usdc > 0) await queueUSDCPayment(paymentSettings.wallet_address, payments.usdc);
    if (payments.stc > 0) await queueSTCPayment(paymentSettings.wallet_address, payments.stc);
  }
};
```

## Global CDN Distribution

### Multi-Region Setup

**DNS-Based Load Balancing:**
```javascript
// Cloudflare Workers or similar edge computing
const routeToOptimalServer = async (request) => {
  const userCountry = request.cf.country;
  const userIP = request.headers.get('CF-Connecting-IP');

  // Route based on geographic location
  const serverMappings = {
    'US': 'us-central.studiochain.com',
    'CA': 'us-central.studiochain.com',
    'DE': 'eu-central.studiochain.com',
    'FR': 'eu-central.studiochain.com',
    'GB': 'eu-central.studiochain.com',
    'JP': 'asia-pacific.studiochain.com',
    'SG': 'asia-pacific.studiochain.com',
    'default': 'eu-central.studiochain.com'
  };

  const targetServer = serverMappings[userCountry] || serverMappings.default;

  // Check server health before routing
  const healthCheck = await fetch(`https://${targetServer}/health`);

  if (!healthCheck.ok) {
    // Fallback to primary server
    return 'eu-central.studiochain.com';
  }

  return targetServer;
};
```

**Server Health Monitoring:**
```javascript
// Health check endpoint on each Contabo server
app.get('/health', async (req, res) => {
  const health = {
    server: process.env.SERVER_REGION,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    storage: await checkStorageSpace(),
    activeStreams: await getActiveStreamCount(),
    load: await getSystemLoad()
  };

  // Check dependencies
  const supabaseHealth = await checkSupabaseConnection();
  if (!supabaseHealth) {
    health.status = 'degraded';
    health.issues = ['supabase_connection_error'];
  }

  res.json(health);
});
```

## Cost Optimization Strategies

### Storage Lifecycle Management

**Automated Content Archival:**
```javascript
// Archive old content to reduce costs
const archiveOldContent = async () => {
  // Find content older than 90 days with low view counts
  const archiveCandidates = await supabase
    .from('content')
    .select(`
      id,
      storage_path,
      created_at,
      content_analytics(total_views)
    `)
    .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .order('content_analytics.total_views', { ascending: true })
    .limit(100);

  for (const content of archiveCandidates) {
    if (content.content_analytics?.total_views < 10) {
      // Move to cold storage (external service or different bucket)
      await moveToColdeStorage(content.id, content.storage_path);

      // Update status
      await supabase
        .from('content')
        .update({ status: 'archived' })
        .eq('id', content.id);
    }
  }
};
```

### Bandwidth Optimization

**Adaptive Bitrate Streaming:**
```javascript
// Dynamic quality adjustment based on user connection
const getOptimalQuality = (userAgent, connectionType) => {
  const qualityMap = {
    '4g': '1080p',
    '3g': '720p',
    'slow-2g': '480p',
    'wifi': '1080p'
  };

  return qualityMap[connectionType] || '720p';
};

// Serve appropriate quality HLS playlist
app.get('/api/stream/:contentId/playlist.m3u8', async (req, res) => {
  const quality = getOptimalQuality(
    req.headers['user-agent'],
    req.headers['connection-type']
  );

  const playlist = await generateAdaptivePlaylist(req.params.contentId, quality);

  res.setHeader('Content-Type', 'application/x-mpegURL');
  res.send(playlist);
});
```

## Monitoring and Analytics

### Performance Metrics

**Real-time Monitoring Dashboard:**
```javascript
// Metrics collection for all servers
const collectMetrics = async () => {
  const metrics = {
    timestamp: new Date().toISOString(),
    server_id: process.env.SERVER_ID,
    active_streams: await getActiveStreamCount(),
    bandwidth_usage: await getBandwidthUsage(), // MB/hour
    storage_used: await getStorageUsage(), // GB
    encoding_queue_length: await getEncodingQueueLength(),
    error_rate: await getErrorRate(), // errors per hour
    response_time: await getAverageResponseTime() // ms
  };

  // Store in Supabase for analysis
  await supabase
    .from('server_metrics')
    .insert(metrics);

  // Alert if thresholds exceeded
  if (metrics.error_rate > 50 || metrics.response_time > 2000) {
    await sendAlert(metrics);
  }
};

// Run metrics collection every minute
setInterval(collectMetrics, 60000);
```

### Creator Analytics

**Revenue and Performance Tracking:**
```javascript
// Generate creator analytics report
const generateCreatorReport = async (creatorId, timeframe) => {
  const { data: analytics } = await supabase
    .from('content_analytics')
    .select(`
      date,
      total_views,
      unique_viewers,
      total_watch_time,
      revenue_generated,
      content!inner(title, created_at)
    `)
    .eq('content.creator_id', creatorId)
    .gte('date', timeframe.start)
    .lte('date', timeframe.end)
    .order('date', { ascending: true });

  const summary = {
    total_revenue: analytics.reduce((sum, a) => sum + a.revenue_generated, 0),
    total_views: analytics.reduce((sum, a) => sum + a.total_views, 0),
    total_watch_hours: analytics.reduce((sum, a) => sum + a.total_watch_time, 0) / 3600,
    average_revenue_per_view: 0,
    top_performing_content: [],
    growth_rate: calculateGrowthRate(analytics)
  };

  summary.average_revenue_per_view = summary.total_revenue / summary.total_views;

  return {
    summary,
    daily_data: analytics,
    recommendations: generateRecommendations(analytics)
  };
};
```

## Deployment and DevOps

### Automated Deployment

**CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy Video Infrastructure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Deploy to Contabo servers
      run: |
        # Deploy to EU server
        ssh -o StrictHostKeyChecking=no ubuntu@eu-server.studiochain.com "
          cd /var/www/studiochain &&
          git pull origin main &&
          npm install --production &&
          pm2 restart all
        "

        # Deploy to US server
        ssh -o StrictHostKeyChecking=no ubuntu@us-server.studiochain.com "
          cd /var/www/studiochain &&
          git pull origin main &&
          npm install --production &&
          pm2 restart all
        "
```

### Backup and Disaster Recovery

**Automated Backups:**
```bash
#!/bin/bash
# Daily backup script

# Database backup via Supabase CLI
supabase db dump --file "/backups/db-$(date +%Y%m%d).sql"

# Video content backup to external storage
rclone sync /var/www/studiochain/videos/ wasabi:studiochain-backup/videos/

# Configuration backup
tar -czf "/backups/config-$(date +%Y%m%d).tar.gz" /etc/nginx /var/www/studiochain/config

# Cleanup old backups (keep 30 days)
find /backups -name "*.sql" -mtime +30 -delete
find /backups -name "*.tar.gz" -mtime +30 -delete
```

## Integration with StudioChain Tokenomics

### Revenue Model Integration

**Infrastructure Cost Integration:**
```javascript
// Calculate true cost per user including infrastructure
const calculateUserProfitability = async (userId, month) => {
  const userMetrics = await getUserMonthlyMetrics(userId, month);

  const costs = {
    subscription_revenue: 10.00, // $10/month subscription
    infrastructure_cost: 0.84, // $84/month ÷ 100 users = $0.84/user
    bandwidth_cost: userMetrics.bandwidth_gb * 0.01, // $0.01/GB
    storage_cost: userMetrics.storage_gb * 0.021, // $0.021/GB (Supabase rate)
    processing_cost: userMetrics.minutes_uploaded * 0.002 // $0.002/minute encoding
  };

  const net_revenue = costs.subscription_revenue -
                     costs.infrastructure_cost -
                     costs.bandwidth_cost -
                     costs.storage_cost -
                     costs.processing_cost;

  // Revenue distribution according to tokenomics
  const distribution = {
    creator_revenue: net_revenue * 0.30, // 30%
    platform_operations: net_revenue * 0.55, // 55%
    stc_buyback: net_revenue * 0.08, // 8%
    user_rewards: net_revenue * 0.04, // 4%
    platform_reserve: net_revenue * 0.03 // 3%
  };

  return {
    costs,
    net_revenue,
    distribution,
    profit_margin: (net_revenue / costs.subscription_revenue) * 100
  };
};
```

### Smart Contract Content Gates

**NFT-Gated Content Access:**
```solidity
// Smart contract integration with video infrastructure
contract ContentAccess {
    mapping(uint256 => string) private contentIPFSHashes;
    mapping(uint256 => string) private contaboStreamURLs;

    function getContentAccess(uint256 contentId, address user)
        external view returns (
            bool hasAccess,
            string memory streamURL,
            string memory quality
        ) {

        // Check subscription NFT
        bool hasSubscription = subscriptionContract.isActive(user);

        // Check content-specific NFT
        bool hasContentNFT = contentNFTContract.ownerOf(contentId) == user;

        // Check STC token balance for premium features
        uint256 stcBalance = stcToken.balanceOf(user);

        if (hasSubscription || hasContentNFT) {
            hasAccess = true;

            // Premium users get Contabo CDN URLs (faster)
            if (stcBalance >= 10000 * 10**18 || hasContentNFT) {
                streamURL = contaboStreamURLs[contentId];
                quality = "1080p";
            } else {
                streamURL = contentIPFSHashes[contentId];
                quality = "720p";
            }
        }

        return (hasAccess, streamURL, quality);
    }
}
```

## Roadmap and Scaling Plan

### Phase 1: MVP Launch (Months 1-3)
- ✅ Single Contabo server (EU region)
- ✅ Supabase Pro integration
- ✅ Basic video upload and streaming
- ✅ Smart contract access control
- ✅ Cost target: $84/month

### Phase 2: Multi-Region Expansion (Months 4-6)
- 🔄 3 Contabo servers (EU, US, Asia)
- 🔄 Advanced video encoding pipeline
- 🔄 Real-time analytics dashboard
- 🔄 Creator revenue distribution
- 🔄 Cost target: $200/month

### Phase 3: Enterprise Features (Months 7-12)
- 📋 Advanced CDN with edge caching
- 📋 AI-powered content recommendations
- 📋 Live streaming capabilities
- 📋 Mobile app optimization
- 📋 Cost target: $500/month

### Phase 4: Web3 Native Features (Year 2)
- 📋 IPFS integration for decentralized storage
- 📋 Livepeer encoding for cost reduction
- 📋 Cross-platform NFT content portability
- 📋 DAO-governed infrastructure decisions
- 📋 Hybrid decentralized/centralized architecture

This infrastructure approach provides a **cost-effective foundation** for StudioChain while maintaining the **flexibility to scale and integrate** with Web3 technologies as the platform grows.