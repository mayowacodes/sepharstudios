<!-- Creator Support -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { isConnected, walletAddress } from '$lib/web3/wallet';
  import WalletConnect from '$lib/components/web3/WalletConnect.svelte';
  import { Coins, Wallet, Crown, TrendingUp, Shield, ExternalLink, RefreshCw, AlertCircle } from '@lucide/svelte';

  let activeSection = 'overview';

  const sections = [
    { id: 'overview', title: 'Support Overview', icon: '🆘' },
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'web3-help', title: 'Web3 & STC Help', icon: '🔗' },
    { id: 'technical', title: 'Technical Issues', icon: '⚙️' },
    { id: 'content', title: 'Content Guidelines', icon: '📝' },
    { id: 'monetization', title: 'Monetization', icon: '💰' },
    { id: 'contact', title: 'Contact Support', icon: '📞' }
  ];

  function submitTicket() {
    goto('/creator/tech-support');
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Support</h1>
    <p class="text-gray-300">Get help with your creator journey on Sephar Studios</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Navigation Sidebar -->
    <div class="lg:col-span-1">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 sticky top-6">
        <nav class="space-y-2">
          {#each sections as section}
            <button
              onclick={() => activeSection = section.id}
              class="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 {activeSection === section.id ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}"
            >
              <span>{section.icon}</span>
              <span class="text-sm font-medium">{section.title}</span>
            </button>
          {/each}
        </nav>
      </div>
    </div>

    <!-- Content Area -->
    <div class="lg:col-span-3">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        {#if activeSection === 'overview'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Welcome to Creator Support</h2>
              <p class="text-gray-300 mb-4">
                We're here to help you succeed on the Sephar Studios platform. Find answers to common questions,
                get technical support, and learn best practices for creating impactful faith-based content.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">📚</span> Knowledge Base
                </h3>
                <p class="text-blue-200 mb-3">
                  Comprehensive guides and tutorials for all aspects of content creation.
                </p>
                <button
                  onclick={() => activeSection = 'getting-started'}
                  class="text-blue-300 hover:text-blue-100 font-medium"
                >
                  Browse Articles →
                </button>
              </div>

              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">🎯</span> Quick Help
                </h3>
                <p class="text-green-200 mb-3">
                  Get instant answers to the most frequently asked questions.
                </p>
                <button
                  onclick={() => activeSection = 'technical'}
                  class="text-green-300 hover:text-green-100 font-medium"
                >
                  View FAQ →
                </button>
              </div>

              <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">💬</span> Community Forum
                </h3>
                <p class="text-purple-200 mb-3">
                  Connect with other creators and share experiences.
                </p>
                <a
                  href="/creator/forum"
                  class="text-purple-300 hover:text-purple-100 font-medium"
                >
                  Join Discussion →
                </a>
              </div>

              <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">🛠️</span> Technical Support
                </h3>
                <p class="text-orange-200 mb-3">
                  Get personalized help from our support team.
                </p>
                <button
                  onclick={submitTicket}
                  class="text-orange-300 hover:text-orange-100 font-medium"
                >
                  Submit Ticket →
                </button>
              </div>
            </div>

            <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">⏰</span> Support Hours
              </h3>
              <div class="text-yellow-200">
                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
                <p><strong>Sunday:</strong> Closed (Emergency support available)</p>
                <p class="mt-2"><strong>Average Response Time:</strong> 2-4 hours during business hours</p>
              </div>
            </div>
          </div>

        {:else if activeSection === 'getting-started'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Getting Started</h2>
              <p class="text-gray-300 mb-6">
                New to Sephar Studios? Here's everything you need to know to start creating.
              </p>
            </div>

            <div class="space-y-4">
              {#each [
                { title: 'Setting Up Your Creator Profile', desc: 'Complete your profile with bio, ministry background, and social links', icon: '👤', link: '/creator/profile' },
                { title: 'Understanding Content Guidelines', desc: 'Learn what content is approved and how to align with our faith-based standards', icon: '📋', link: '/creator/guidelines' },
                { title: 'Uploading Your First Video', desc: 'Step-by-step guide to uploading, optimizing, and publishing content', icon: '📹', link: '/creator/upload' },
                { title: 'Analytics and Performance', desc: 'Track your content performance and understand your audience', icon: '📊', link: '/creator/analytics' },
                { title: 'Monetization Options', desc: 'Explore revenue opportunities including sponsorships and donations', icon: '💰', link: null }
              ] as item}
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="flex items-start space-x-4">
                    <div class="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white text-xl">
                      {item.icon}
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-white mb-2">{item.title}</h3>
                      <p class="text-gray-300 mb-3">{item.desc}</p>
                      {#if item.link}
                        <a href={item.link} class="text-purple-400 hover:text-purple-300 font-medium">
                          Learn More →
                        </a>
                      {:else}
                        <button onclick={() => activeSection = 'monetization'} class="text-purple-400 hover:text-purple-300 font-medium">
                          Learn More →
                        </button>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>

        {:else if activeSection === 'web3-help'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Web3 & STC Tokenomics Help</h2>
              <p class="text-gray-300 mb-6">
                Everything you need to know about StudioChain (STC) tokens, wallet integration, and Web3 earning features.
              </p>
            </div>

            <!-- Wallet Connection Status -->
            {#if !$isConnected}
              <Card class="bg-gradient-to-r from-orange-500/10 to-accent/10 border-orange-500/20">
                <CardContent class="p-6 text-center">
                  <Wallet class="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
                  <p class="text-muted-foreground mb-4">Connect your wallet to access STC earnings and premium creator features</p>
                  <WalletConnect />
                </CardContent>
              </Card>
            {:else}
              <Card class="bg-gradient-to-r from-green-500/10 to-accent/10 border-green-500/20">
                <CardContent class="p-4 text-center">
                  <div class="flex items-center justify-center space-x-3">
                    <Shield class="h-6 w-6 text-green-500" />
                    <span class="text-green-400 font-medium">Wallet Connected</span>
                    <Badge variant="outline" class="text-green-400 border-green-400">
                      {$walletAddress?.slice(0, 6)}...{$walletAddress?.slice(-4)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            {/if}

            <!-- Web3 FAQ -->
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>

                <div class="space-y-4">
                  <!-- STC Token Basics -->
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2 flex items-center">
                      <Coins class="h-5 w-5 mr-2 text-accent" />
                      What are STC tokens?
                    </h4>
                    <p class="text-gray-300 text-sm mb-3">
                      StudioChain (STC) tokens are the native cryptocurrency of our platform. You earn STC tokens for creating quality content,
                      and viewers earn them for watching and engaging with content. STC can be staked for subscription discounts or converted to fiat currency.
                    </p>
                    <div class="bg-accent/10 p-3 rounded border-l-4 border-accent">
                      <p class="text-accent font-medium text-sm">
                        <strong>Creator Benefits:</strong> Higher STC holdings unlock better revenue shares (30% → 55%)
                      </p>
                    </div>
                  </div>

                  <!-- Wallet Setup -->
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2 flex items-center">
                      <Wallet class="h-5 w-5 mr-2 text-primary" />
                      How do I set up a wallet?
                    </h4>
                    <p class="text-gray-300 text-sm mb-3">
                      We support MetaMask, WalletConnect, and other popular wallets. Here's how to get started:
                    </p>
                    <ol class="text-gray-300 text-sm space-y-2 ml-4 list-decimal">
                      <li>Install MetaMask browser extension or mobile app</li>
                      <li>Create a new wallet and securely save your seed phrase</li>
                      <li>Switch to the Polygon network (we use Polygon for lower fees)</li>
                      <li>Click "Connect Wallet" on StudioChain to link your wallet</li>
                    </ol>
                    <div class="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline" onclick={() => window.open('https://metamask.io', '_blank')}>
                        <ExternalLink class="mr-2 h-4 w-4" />
                        Get MetaMask
                      </Button>
                      <Button size="sm" variant="outline" onclick={() => goto('/tokens')}>
                        <Coins class="mr-2 h-4 w-4" />
                        Learn About STC
                      </Button>
                    </div>
                  </div>

                  <!-- Earning STC -->
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2 flex items-center">
                      <TrendingUp class="h-5 w-5 mr-2 text-secondary" />
                      How do I earn STC as a creator?
                    </h4>
                    <p class="text-gray-300 text-sm mb-3">
                      Creators earn STC tokens through multiple revenue streams:
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div class="bg-primary/10 p-3 rounded">
                        <div class="font-medium text-primary mb-1">Content Views</div>
                        <div class="text-gray-300">Base STC per view based on content type and engagement</div>
                      </div>
                      <div class="bg-secondary/10 p-3 rounded">
                        <div class="font-medium text-secondary mb-1">Premium Bonuses</div>
                        <div class="text-gray-300">Extra STC for high-quality, educational content</div>
                      </div>
                      <div class="bg-accent/10 p-3 rounded">
                        <div class="font-medium text-accent mb-1">Completion Rewards</div>
                        <div class="text-gray-300">Bonus STC when viewers complete your content</div>
                      </div>
                      <div class="bg-green-500/10 p-3 rounded">
                        <div class="font-medium text-green-400 mb-1">Staking Benefits</div>
                        <div class="text-gray-300">Higher revenue share with more STC staked</div>
                      </div>
                    </div>
                  </div>

                  <!-- Creator Tiers -->
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2 flex items-center">
                      <Crown class="h-5 w-5 mr-2 text-accent" />
                      What are creator tiers?
                    </h4>
                    <p class="text-gray-300 text-sm mb-3">
                      Creator tiers determine your revenue share and unlock exclusive features:
                    </p>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <div class="flex items-center space-x-2">
                          <Badge variant="outline">Standard</Badge>
                          <span class="text-sm">0-25K STC</span>
                        </div>
                        <span class="text-sm font-medium">30% Revenue Share</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-secondary/20 rounded">
                        <div class="flex items-center space-x-2">
                          <Badge variant="secondary">Exclusive</Badge>
                          <span class="text-sm">25K+ STC</span>
                        </div>
                        <span class="text-sm font-medium">40% Revenue Share</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-primary/20 rounded">
                        <div class="flex items-center space-x-2">
                          <Badge variant="default">Top Performer</Badge>
                          <span class="text-sm">100K+ STC</span>
                        </div>
                        <span class="text-sm font-medium">55% Revenue Share</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <Button size="sm" onclick={() => goto('/creator/earnings')}>
                        <Crown class="mr-2 h-4 w-4" />
                        View My Tier Status
                      </Button>
                    </div>
                  </div>

                  <!-- Troubleshooting -->
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2 flex items-center">
                      <AlertCircle class="h-5 w-5 mr-2 text-yellow-500" />
                      Common Web3 Issues
                    </h4>
                    <div class="space-y-3">
                      <div class="border-l-4 border-red-500 pl-3">
                        <div class="font-medium text-red-400 text-sm">Wallet won't connect</div>
                        <ul class="text-gray-300 text-xs space-y-1 mt-1">
                          <li>• Make sure you're on the correct network (Polygon)</li>
                          <li>• Try refreshing the page and reconnecting</li>
                          <li>• Check if your wallet extension is updated</li>
                          <li>• Disable other wallet extensions temporarily</li>
                        </ul>
                      </div>

                      <div class="border-l-4 border-orange-500 pl-3">
                        <div class="font-medium text-orange-400 text-sm">STC not showing in wallet</div>
                        <ul class="text-gray-300 text-xs space-y-1 mt-1">
                          <li>• Add STC token contract to your wallet</li>
                          <li>• Earnings are distributed weekly (Fridays)</li>
                          <li>• Check if you've completed minimum earning threshold</li>
                          <li>• Verify your wallet address in creator settings</li>
                        </ul>
                      </div>

                      <div class="border-l-4 border-blue-500 pl-3">
                        <div class="font-medium text-blue-400 text-sm">Transaction failed</div>
                        <ul class="text-gray-300 text-xs space-y-1 mt-1">
                          <li>• Ensure you have enough MATIC for gas fees</li>
                          <li>• Try increasing gas limit in wallet settings</li>
                          <li>• Wait for network congestion to clear</li>
                          <li>• Use recommended gas price from wallet</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card class="bg-primary/10 border-primary/20">
                  <CardContent class="p-4 text-center">
                    <Coins class="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 class="font-medium text-white mb-2">Manage STC</h4>
                    <p class="text-muted-foreground text-sm mb-3">View balance, stake tokens, convert to fiat</p>
                    <Button size="sm" href="/tokens" class="w-full">
                      Open Token Dashboard
                    </Button>
                  </CardContent>
                </Card>

                <Card class="bg-secondary/10 border-secondary/20">
                  <CardContent class="p-4 text-center">
                    <TrendingUp class="h-8 w-8 text-secondary mx-auto mb-2" />
                    <h4 class="font-medium text-white mb-2">Revenue Analytics</h4>
                    <p class="text-muted-foreground text-sm mb-3">Track STC earnings and revenue breakdown</p>
                    <Button size="sm" href="/creator/earnings" variant="outline" class="w-full">
                      View Earnings
                    </Button>
                  </CardContent>
                </Card>

                <Card class="bg-accent/10 border-accent/20">
                  <CardContent class="p-4 text-center">
                    <Crown class="h-8 w-8 text-accent mx-auto mb-2" />
                    <h4 class="font-medium text-white mb-2">Upgrade Tier</h4>
                    <p class="text-muted-foreground text-sm mb-3">Stake more STC for higher revenue share</p>
                    <Button size="sm" href="/staking" variant="outline" class="w-full">
                      Stake STC
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <!-- Resources -->
              <Card class="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <ExternalLink class="h-5 w-5" />
                    <span>Additional Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 class="font-medium text-white mb-2">Documentation</h4>
                      <ul class="space-y-1 text-muted-foreground">
                        <li><a href="/docs/tokenomics" class="hover:text-white transition-colors">• Complete Tokenomics Guide</a></li>
                        <li><a href="/docs/staking" class="hover:text-white transition-colors">• Staking Tutorial</a></li>
                        <li><a href="/docs/wallet-setup" class="hover:text-white transition-colors">• Wallet Setup Guide</a></li>
                        <li><a href="/docs/creator-tiers" class="hover:text-white transition-colors">• Creator Tier Benefits</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-2">Community</h4>
                      <ul class="space-y-1 text-muted-foreground">
                        <li><a href="/discord" class="hover:text-white transition-colors">• Discord Community</a></li>
                        <li><a href="/forum/web3" class="hover:text-white transition-colors">• Web3 Discussion Forum</a></li>
                        <li><a href="/webinars" class="hover:text-white transition-colors">• Weekly Web3 Webinars</a></li>
                        <li><a href="/support/web3-office-hours" class="hover:text-white transition-colors">• Web3 Office Hours</a></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        {:else if activeSection === 'technical'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Technical Issues</h2>
              <p class="text-gray-300 mb-6">
                Common technical problems and their solutions.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Upload Issues</h3>
                <div class="space-y-3">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">Video upload fails or gets stuck</h4>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Check your internet connection stability</li>
                      <li>• Ensure file size is under 5GB</li>
                      <li>• Try uploading during off-peak hours</li>
                      <li>• Use supported formats: MP4 (H.264/H.265)</li>
                    </ul>
                  </div>
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">Poor video quality after upload</h4>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Upload in highest available resolution (up to 4K)</li>
                      <li>• Use appropriate bitrate for your resolution</li>
                      <li>• Allow 24-48 hours for full quality processing</li>
                      <li>• Check original file quality before upload</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Audio Problems</h3>
                <div class="space-y-3">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">Audio out of sync</h4>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Re-export video with audio properly synced</li>
                      <li>• Use consistent frame rate (24, 25, or 30 fps)</li>
                      <li>• Check audio sample rate (44.1 or 48 kHz recommended)</li>
                    </ul>
                  </div>
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">Low audio quality</h4>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Use AAC or MP3 format for audio</li>
                      <li>• Ensure minimum 16-bit depth</li>
                      <li>• Record in quiet environment with good microphone</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Account & Access</h3>
                <div class="space-y-3">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">Can't access creator dashboard</h4>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Clear browser cache and cookies</li>
                      <li>• Try incognito/private browsing mode</li>
                      <li>• Disable browser extensions temporarily</li>
                      <li>• Check if creator account is approved</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'content'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Content Guidelines Help</h2>
              <p class="text-gray-300 mb-6">
                Understand our content standards and how to create compliant content.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">✅ Content That Thrives</h3>
                <ul class="space-y-2 text-green-200">
                  <li>• Biblical teaching and sermons</li>
                  <li>• Personal testimony and faith stories</li>
                  <li>• Worship music and Christian performances</li>
                  <li>• Family-friendly entertainment with Christian values</li>
                  <li>• Educational content about Christian living</li>
                </ul>
              </div>

              <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">⚠️ Content Under Review</h3>
                <ul class="space-y-2 text-yellow-200">
                  <li>• Content addressing controversial topics (needs careful approach)</li>
                  <li>• Historical or biographical content (context matters)</li>
                  <li>• Discussions of other religions (must be respectful)</li>
                  <li>• Social issues from a Christian perspective</li>
                </ul>
              </div>

              <div class="bg-red-600/20 border border-red-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">❌ Content Not Allowed</h3>
                <ul class="space-y-2 text-red-200">
                  <li>• Content with profanity or inappropriate language</li>
                  <li>• Violent or disturbing imagery</li>
                  <li>• Content promoting other religions or anti-Christian views</li>
                  <li>• Political endorsements or partisan content</li>
                  <li>• Commercial advertising without approval</li>
                </ul>
              </div>
            </div>

            <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2">💡 Need Clarification?</h3>
              <p class="text-blue-200 mb-3">
                If you're unsure whether your content meets our guidelines, feel free to reach out before uploading.
              </p>
              <button onclick={submitTicket} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                Ask Our Team
              </button>
            </div>
          </div>

        {:else if activeSection === 'monetization'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Monetization Support</h2>
              <p class="text-gray-300 mb-6">
                Learn about revenue opportunities and how to monetize your ministry content.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                  <span class="mr-2">🎬</span> Sponsorship Program
                </h3>
                <p class="text-gray-300 mb-4">Get funding for your film and content projects.</p>
                <ul class="space-y-2 text-gray-300 text-sm mb-4">
                  <li>• Film production funding</li>
                  <li>• Equipment sponsorship</li>
                  <li>• Marketing support</li>
                </ul>
                <a href="/sponsorships" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium inline-block">
                  Apply Now
                </a>
              </div>

              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                  <span class="mr-2">💝</span> Donation Integration
                </h3>
                <p class="text-gray-300 mb-4">Allow viewers to support your ministry directly.</p>
                <ul class="space-y-2 text-gray-300 text-sm mb-4">
                  <li>• One-time donations</li>
                  <li>• Monthly supporters</li>
                  <li>• Project-specific funding</li>
                </ul>
                <button onclick={submitTicket} class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                  Set Up Donations
                </button>
              </div>
            </div>

            <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2">📈 Revenue Requirements</h3>
              <div class="text-purple-200 space-y-2">
                <p>• Minimum 1,000 subscribers to enable donations</p>
                <p>• Content must comply with all platform guidelines</p>
                <p>• Active creator status (upload at least monthly)</p>
                <p>• Completed tax information (US creators)</p>
              </div>
            </div>
          </div>

        {:else if activeSection === 'contact'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Contact Support</h2>
              <p class="text-gray-300 mb-6">
                Get personalized help from our Creator Support team.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4">📧 Email Support</h3>
                <p class="text-gray-300 mb-4">For non-urgent questions and detailed support requests.</p>
                <p class="text-purple-400 font-medium mb-2">support@sepharstudios.com</p>
                <p class="text-gray-400 text-sm">Response time: 4-8 hours</p>
              </div>

              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4">💬 Live Chat</h3>
                <p class="text-gray-300 mb-4">Real-time support during business hours.</p>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                  Start Chat
                </button>
                <p class="text-gray-400 text-sm mt-2">Available Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>

            <div class="bg-white/5 rounded-lg p-6">
              <h3 class="text-lg font-bold text-white mb-4">🎫 Submit Support Ticket</h3>
              <p class="text-gray-300 mb-4">For technical issues or complex problems that need detailed attention.</p>
              <button onclick={submitTicket} class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
                Create Support Ticket
              </button>
            </div>

            <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2">🚨 Emergency Support</h3>
              <p class="text-yellow-200">
                For urgent issues affecting live streams or time-sensitive content, contact our emergency line:
                <strong class="block mt-1">(555) 123-HELP</strong>
              </p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
