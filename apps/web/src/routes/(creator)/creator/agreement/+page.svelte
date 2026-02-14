<!-- Creator Agreement -->
<script lang="ts">
  let activeSection = 'overview';
  let hasAccepted = false;
  let showFullAgreement = false;

  const sections = [
    { id: 'overview', title: 'Agreement Overview', icon: '📋' },
    { id: 'content-standards', title: 'Content Standards', icon: '✝️' },
    { id: 'rights-responsibilities', title: 'Rights & Responsibilities', icon: '⚖️' },
    { id: 'monetization', title: 'Monetization Terms', icon: '💰' },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: '©️' },
    { id: 'community-guidelines', title: 'Community Guidelines', icon: '👥' }
  ];

  function acceptAgreement() {
    hasAccepted = true;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Agreement</h1>
    <p class="text-gray-300">Terms and conditions for content creators on Sephar Studios</p>
  </div>

  <!-- Agreement Status -->
  {#if hasAccepted}
    <div class="bg-green-600/20 border border-green-600 rounded-xl p-4">
      <div class="flex items-center">
        <span class="text-2xl mr-3">✅</span>
        <div>
          <h3 class="text-lg font-bold text-white">Agreement Accepted</h3>
          <p class="text-green-200">You have accepted the Creator Agreement. Thank you for being part of our community!</p>
        </div>
      </div>
    </div>
  {:else}
    <div class="bg-yellow-600/20 border border-yellow-600 rounded-xl p-4">
      <div class="flex items-center">
        <span class="text-2xl mr-3">⚠️</span>
        <div>
          <h3 class="text-lg font-bold text-white">Agreement Required</h3>
          <p class="text-yellow-200">Please review and accept our Creator Agreement to continue using creator features.</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Last Updated -->
  <div class="text-center text-gray-400 text-sm">
    Last updated: January 15, 2024 | Version 2.1
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

        {#if !hasAccepted}
          <div class="mt-6 pt-6 border-t border-white/20">
            <button
              onclick={() => showFullAgreement = !showFullAgreement}
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm mb-3"
            >
              {showFullAgreement ? 'Hide' : 'View'} Full Agreement
            </button>
            <button
              onclick={acceptAgreement}
              class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
            >
              Accept Agreement
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Content Area -->
    <div class="lg:col-span-3">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        {#if activeSection === 'overview'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Creator Agreement Overview</h2>
              <p class="text-gray-300 mb-4">
                Welcome to Sephar Studios! This Creator Agreement outlines the terms and conditions for content creators
                using our faith-based streaming platform. By creating and uploading content, you agree to these terms.
              </p>
            </div>

            <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">🎯</span> Our Mission
              </h3>
              <p class="text-blue-200">
                Sephar Studios exists to provide a safe, inspiring platform where Christian creators can share their
                God-given talents and stories to reach hearts worldwide with the message of Jesus Christ.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white/5 rounded-lg p-4">
                <h4 class="font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">✅</span> What We Provide
                </h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>• Global streaming platform</li>
                  <li>• Content hosting and delivery</li>
                  <li>• Analytics and insights</li>
                  <li>• Creator community and support</li>
                  <li>• Monetization opportunities</li>
                  <li>• Technical infrastructure</li>
                </ul>
              </div>

              <div class="bg-white/5 rounded-lg p-4">
                <h4 class="font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">🤝</span> What We Expect
                </h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  <li>• Faith-based, family-friendly content</li>
                  <li>• Adherence to community guidelines</li>
                  <li>• Original or properly licensed material</li>
                  <li>• Respectful interaction with community</li>
                  <li>• Compliance with technical standards</li>
                  <li>• Commitment to Christian values</li>
                </ul>
              </div>
            </div>

            <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">⭐</span> Creator Benefits
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div class="text-green-200 font-medium">Platform Features</div>
                  <ul class="text-green-200 text-sm space-y-1">
                    <li>• Unlimited uploads</li>
                    <li>• 4K video support</li>
                    <li>• Live streaming</li>
                    <li>• Custom thumbnails</li>
                  </ul>
                </div>
                <div>
                  <div class="text-green-200 font-medium">Growth Tools</div>
                  <ul class="text-green-200 text-sm space-y-1">
                    <li>• Detailed analytics</li>
                    <li>• Audience insights</li>
                    <li>• SEO optimization</li>
                    <li>• Cross-promotion</li>
                  </ul>
                </div>
                <div>
                  <div class="text-green-200 font-medium">Support & Community</div>
                  <ul class="text-green-200 text-sm space-y-1">
                    <li>• 24/7 technical support</li>
                    <li>• Creator workshops</li>
                    <li>• Networking events</li>
                    <li>• Ministry resources</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2">📜 Key Agreement Points</h3>
              <ul class="text-purple-200 text-sm space-y-2">
                <li>• You retain ownership of your original content</li>
                <li>• We reserve the right to review and moderate content</li>
                <li>• Content must align with Christian values and our guidelines</li>
                <li>• We provide platform services, you create amazing content</li>
                <li>• Both parties can terminate the agreement with proper notice</li>
                <li>• Disputes are resolved through Christian mediation when possible</li>
              </ul>
            </div>
          </div>

        {:else if activeSection === 'content-standards'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Content Standards</h2>
              <p class="text-gray-300 mb-6">
                All content on Sephar Studios must align with Christian values and our community standards.
              </p>
            </div>

            <div class="space-y-6">
              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">✅</span> Required Content Standards
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-white mb-2">Faith-Based Requirements</h4>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Aligns with core Christian beliefs</li>
                      <li>• Promotes Biblical values and morals</li>
                      <li>• Respectful of Christian denominations</li>
                      <li>• Encourages spiritual growth</li>
                      <li>• Points viewers toward Jesus Christ</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Quality Standards</h4>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Original content or proper licensing</li>
                      <li>• Meets technical specifications</li>
                      <li>• Family-friendly and appropriate</li>
                      <li>• Professional presentation quality</li>
                      <li>• Clear audio and video</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-red-600/20 border border-red-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">❌</span> Prohibited Content
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-white mb-2">Content Violations</h4>
                    <ul class="text-red-200 text-sm space-y-1">
                      <li>• Profanity or vulgar language</li>
                      <li>• Sexual content or nudity</li>
                      <li>• Violence or graphic imagery</li>
                      <li>• Hate speech or discrimination</li>
                      <li>• Promoting other religions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Platform Violations</h4>
                    <ul class="text-red-200 text-sm space-y-1">
                      <li>• Copyright infringement</li>
                      <li>• Spam or misleading content</li>
                      <li>• Commercial advertising (unauthorized)</li>
                      <li>• Political endorsements</li>
                      <li>• Controversial social stances</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">📝 Content Review Process</h3>
                <div class="space-y-3">
                  <div class="flex items-start space-x-3">
                    <span class="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">1</span>
                    <div>
                      <div class="text-white font-medium">Initial Upload</div>
                      <div class="text-blue-200 text-sm">Content is submitted and enters review queue</div>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <span class="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">2</span>
                    <div>
                      <div class="text-white font-medium">Theological Review</div>
                      <div class="text-blue-200 text-sm">Content reviewed for biblical accuracy and alignment</div>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <span class="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">3</span>
                    <div>
                      <div class="text-white font-medium">Technical Quality Check</div>
                      <div class="text-blue-200 text-sm">Video/audio quality and technical standards verified</div>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <span class="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">4</span>
                    <div>
                      <div class="text-white font-medium">Final Approval</div>
                      <div class="text-blue-200 text-sm">Content approved and published to platform</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'rights-responsibilities'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Rights & Responsibilities</h2>
              <p class="text-gray-300 mb-6">
                Understanding the rights and responsibilities of both creators and Sephar Studios.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">👤 Creator Rights</h3>
                <ul class="text-green-200 text-sm space-y-2">
                  <li>• Retain ownership of original content</li>
                  <li>• Receive credit and attribution</li>
                  <li>• Access platform analytics and data</li>
                  <li>• Participate in monetization programs</li>
                  <li>• Request content removal or modification</li>
                  <li>• Appeal content moderation decisions</li>
                  <li>• Terminate agreement with 30-day notice</li>
                </ul>
              </div>

              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">🏢 Platform Rights</h3>
                <ul class="text-blue-200 text-sm space-y-2">
                  <li>• Host and distribute content globally</li>
                  <li>• Moderate content for compliance</li>
                  <li>• Remove content violating guidelines</li>
                  <li>• Suspend accounts for repeated violations</li>
                  <li>• Modify platform features and terms</li>
                  <li>• Use content for platform promotion</li>
                  <li>• Terminate agreement for cause</li>
                </ul>
              </div>

              <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">📋 Creator Responsibilities</h3>
                <ul class="text-orange-200 text-sm space-y-2">
                  <li>• Create original or properly licensed content</li>
                  <li>• Follow community guidelines and standards</li>
                  <li>• Respond to community interactions respectfully</li>
                  <li>• Maintain accurate account information</li>
                  <li>• Report technical issues or violations</li>
                  <li>• Comply with copyright and intellectual property laws</li>
                  <li>• Provide proper attribution for non-original content</li>
                </ul>
              </div>

              <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">🛡️ Platform Responsibilities</h3>
                <ul class="text-purple-200 text-sm space-y-2">
                  <li>• Provide reliable hosting and streaming</li>
                  <li>• Maintain platform security and privacy</li>
                  <li>• Offer technical support and assistance</li>
                  <li>• Process payments accurately and timely</li>
                  <li>• Respect creator intellectual property</li>
                  <li>• Provide clear guidelines and policies</li>
                  <li>• Maintain family-friendly environment</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-3">⚖️ Dispute Resolution</h3>
              <p class="text-yellow-200 mb-3">
                In keeping with Christian principles, we encourage resolving disputes through:
              </p>
              <ol class="text-yellow-200 text-sm space-y-1">
                <li>1. Direct communication and prayer</li>
                <li>2. Mediation with platform support team</li>
                <li>3. Christian mediation services when available</li>
                <li>4. Binding arbitration as final resort</li>
              </ol>
            </div>
          </div>

        {:else if activeSection === 'monetization'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Monetization Terms</h2>
              <p class="text-gray-300 mb-6">
                Guidelines for earning revenue through your content on Sephar Studios.
              </p>
            </div>

            <div class="space-y-6">
              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">💰 Revenue Sharing</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-white mb-2">Creator Share: 70%</h4>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Direct donations and tips</li>
                      <li>• Subscription revenue</li>
                      <li>• Merchandise sales commission</li>
                      <li>• Sponsored content earnings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Platform Share: 30%</h4>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Platform maintenance and hosting</li>
                      <li>• Payment processing fees</li>
                      <li>• Technical support and development</li>
                      <li>• Community features and tools</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">💳 Payment Terms</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-white mb-2">Payment Schedule</h4>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• Monthly payments on the 15th</li>
                      <li>• Minimum threshold: $50</li>
                      <li>• Hold period: 30 days for new creators</li>
                      <li>• Direct deposit or PayPal</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Tax Requirements</h4>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• 1099 forms for US creators (>$600)</li>
                      <li>• International tax compliance</li>
                      <li>• Withholding for non-US creators</li>
                      <li>• Ministry/non-profit considerations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">🎯 Monetization Requirements</h3>
                <div class="space-y-3">
                  <div>
                    <h4 class="font-medium text-white mb-2">Eligibility Criteria</h4>
                    <ul class="text-purple-200 text-sm space-y-1">
                      <li>• Minimum 1,000 subscribers</li>
                      <li>• 4,000+ hours of watch time (past 12 months)</li>
                      <li>• Active creator status (monthly uploads)</li>
                      <li>• Compliance with all community guidelines</li>
                      <li>• Completed creator verification process</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Ongoing Requirements</h4>
                    <ul class="text-purple-200 text-sm space-y-1">
                      <li>• Maintain content quality standards</li>
                      <li>• Regular community engagement</li>
                      <li>• Transparent financial disclosures</li>
                      <li>• Compliance with sponsorship guidelines</li>
                      <li>• Timely response to platform communications</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">🤝 Sponsorship Guidelines</h3>
                <div class="space-y-2">
                  <div class="text-orange-200 text-sm">
                    <strong>Allowed Sponsorships:</strong> Christian organizations, family-friendly brands, ministry-supporting businesses
                  </div>
                  <div class="text-orange-200 text-sm">
                    <strong>Required Disclosures:</strong> Clear identification of sponsored content and partnerships
                  </div>
                  <div class="text-orange-200 text-sm">
                    <strong>Platform Approval:</strong> Major sponsorship deals require pre-approval
                  </div>
                  <div class="text-orange-200 text-sm">
                    <strong>Content Control:</strong> Creators maintain editorial control over sponsored content
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'intellectual-property'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p class="text-gray-300 mb-6">
                Protection of intellectual property rights for creators and content users.
              </p>
            </div>

            <div class="space-y-6">
              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">©️ Creator Ownership Rights</h3>
                <ul class="text-green-200 text-sm space-y-2">
                  <li>• You retain full ownership of your original content</li>
                  <li>• Platform receives limited license to host and distribute</li>
                  <li>• You can remove content at any time with 30-day notice</li>
                  <li>• Attribution rights are protected and maintained</li>
                  <li>• Derivative works require your explicit permission</li>
                  <li>• Commercial use rights remain with creator</li>
                </ul>
              </div>

              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">📋 Platform License</h3>
                <p class="text-blue-200 mb-3">
                  By uploading content, you grant Sephar Studios a limited, non-exclusive license to:
                </p>
                <ul class="text-blue-200 text-sm space-y-1">
                  <li>• Host and stream your content globally</li>
                  <li>• Create thumbnails and previews</li>
                  <li>• Transcode for different devices and quality levels</li>
                  <li>• Display in search results and recommendations</li>
                  <li>• Use in platform marketing (with attribution)</li>
                  <li>• Archive for platform operations</li>
                </ul>
              </div>

              <div class="bg-red-600/20 border border-red-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">⚠️ Copyright Compliance</h3>
                <div class="space-y-3">
                  <div>
                    <h4 class="font-medium text-white mb-2">Your Responsibilities</h4>
                    <ul class="text-red-200 text-sm space-y-1">
                      <li>• Ensure all content is original or properly licensed</li>
                      <li>• Obtain necessary permissions for music, images, footage</li>
                      <li>• Provide proper attribution for third-party content</li>
                      <li>• Respond promptly to copyright concerns</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">DMCA Process</h4>
                    <ul class="text-red-200 text-sm space-y-1">
                      <li>• We respond to valid DMCA takedown notices</li>
                      <li>• Creators can file counter-notifications</li>
                      <li>• Repeat infringers may face account termination</li>
                      <li>• Good faith efforts are considered in enforcement</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">🎵 Music and Media Usage</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-white mb-2">Approved Sources</h4>
                    <ul class="text-purple-200 text-sm space-y-1">
                      <li>• Original compositions</li>
                      <li>• Royalty-free music libraries</li>
                      <li>• Creative Commons licensed works</li>
                      <li>• Public domain content</li>
                      <li>• Platform-provided music library</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Licensing Required</h4>
                    <ul class="text-purple-200 text-sm space-y-1">
                      <li>• Commercial music recordings</li>
                      <li>• Popular songs and hymns</li>
                      <li>• Movie/TV show clips</li>
                      <li>• Stock photography</li>
                      <li>• Third-party graphics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'community-guidelines'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Community Guidelines</h2>
              <p class="text-gray-300 mb-6">
                Building a positive, supportive community centered on Christian values.
              </p>
            </div>

            <div class="space-y-6">
              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">❤️ Community Values</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-white mb-2">Love and Grace</h4>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Treat others with kindness and respect</li>
                      <li>• Show grace in disagreements</li>
                      <li>• Encourage and uplift fellow creators</li>
                      <li>• Forgive mistakes and offer second chances</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Truth and Authenticity</h4>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Be honest and transparent</li>
                      <li>• Share genuine experiences and testimony</li>
                      <li>• Admit when you don't know something</li>
                      <li>• Correct misinformation promptly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">🤝 Interaction Guidelines</h3>
                <div class="space-y-3">
                  <div>
                    <h4 class="font-medium text-white mb-2">Positive Engagement</h4>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• Respond to comments and messages thoughtfully</li>
                      <li>• Support other creators through likes, shares, and comments</li>
                      <li>• Participate constructively in community discussions</li>
                      <li>• Offer help and mentorship to new creators</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Conflict Resolution</h4>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• Address disagreements privately when possible</li>
                      <li>• Focus on issues, not personal attacks</li>
                      <li>• Seek understanding before seeking to be understood</li>
                      <li>• Involve moderators when necessary</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-red-600/20 border border-red-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">🚫 Prohibited Behaviors</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-white mb-2">Harassment and Abuse</h4>
                    <ul class="text-red-200 text-sm space-y-1">
                      <li>• Personal attacks or bullying</li>
                      <li>• Discriminatory language or behavior</li>
                      <li>• Doxxing or sharing private information</li>
                      <li>• Threatening or intimidating messages</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-medium text-white mb-2">Platform Abuse</h4>
                    <ul class="text-red-200 text-sm space-y-1">
                      <li>• Spam or excessive self-promotion</li>
                      <li>• Fake accounts or impersonation</li>
                      <li>• Vote manipulation or artificial engagement</li>
                      <li>• Circumventing community guidelines</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3">📞 Reporting and Support</h3>
                <div class="space-y-2">
                  <div class="text-purple-200 text-sm">
                    <strong>Report Issues:</strong> Use the report button or contact support@sepharstudios.com
                  </div>
                  <div class="text-purple-200 text-sm">
                    <strong>Get Help:</strong> Technical support available 24/7, community support in forums
                  </div>
                  <div class="text-purple-200 text-sm">
                    <strong>Appeal Decisions:</strong> Moderation decisions can be appealed within 30 days
                  </div>
                  <div class="text-purple-200 text-sm">
                    <strong>Escalation:</strong> Serious issues are reviewed by senior staff and ministry leaders
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Agreement Actions -->
  {#if !hasAccepted}
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <h3 class="text-xl font-bold text-white mb-4">Ready to Join Our Creator Community?</h3>
      <p class="text-gray-300 mb-6">
        By accepting this agreement, you're committing to help us build a platform that honors God
        and serves the global Christian community.
      </p>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onclick={() => showFullAgreement = true}
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
        >
          📄 Download Full Agreement (PDF)
        </button>
        <button
          onclick={acceptAgreement}
          class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
        >
          ✅ I Accept the Creator Agreement
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-4">
        By clicking "I Accept", you agree to abide by all terms and conditions outlined in this agreement.
      </p>
    </div>
  {:else}
    <div class="bg-green-600/20 border border-green-600 rounded-xl p-6 text-center">
      <h3 class="text-xl font-bold text-white mb-4">Welcome to the Sephar Studios Creator Community! 🎉</h3>
      <p class="text-green-200 mb-6">
        Thank you for joining our mission to spread the Gospel through digital media.
        You now have access to all creator features and monetization opportunities.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/creator/upload" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
          📹 Upload Your First Video
        </a>
        <a href="/creator/support" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
          📚 Browse Creator Resources
        </a>
        <a href="/creator/forum" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
          👥 Join Creator Community
        </a>
      </div>
    </div>
  {/if}
</div>