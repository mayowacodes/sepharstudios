<!-- Creator Analytics Help -->
<script lang="ts">
  let activeSection = 'overview';

  const sections = [
    { id: 'overview', title: 'Analytics Overview', icon: '📊' },
    { id: 'metrics', title: 'Key Metrics', icon: '📈' },
    { id: 'interpretation', title: 'Data Interpretation', icon: '🔍' },
    { id: 'optimization', title: 'Content Optimization', icon: '⚡' },
    { id: 'reporting', title: 'Reports & Insights', icon: '📋' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' }
  ];
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Analytics Help</h1>
    <p class="text-gray-300">Understand your audience and optimize your content performance</p>
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
              <h2 class="text-2xl font-bold text-white mb-4">Analytics Overview</h2>
              <p class="text-gray-300 mb-4">
                Analytics help you understand your audience, measure your ministry impact, and optimize your content
                to reach more people with the Gospel message.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">👁️</span> Audience Insights
                </h3>
                <p class="text-blue-200 mb-3">
                  Understand who's watching your content and how they engage with your ministry.
                </p>
                <ul class="text-blue-200 text-sm space-y-1">
                  <li>• Demographics and location data</li>
                  <li>• Viewing patterns and preferences</li>
                  <li>• Spiritual interest indicators</li>
                </ul>
              </div>

              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">⚡</span> Performance Metrics
                </h3>
                <p class="text-green-200 mb-3">
                  Track how your content performs and identify opportunities for improvement.
                </p>
                <ul class="text-green-200 text-sm space-y-1">
                  <li>• Watch time and retention rates</li>
                  <li>• Engagement and interaction data</li>
                  <li>• Growth and reach metrics</li>
                </ul>
              </div>

              <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">🎯</span> Ministry Impact
                </h3>
                <p class="text-purple-200 mb-3">
                  Measure the spiritual impact of your content beyond traditional metrics.
                </p>
                <ul class="text-purple-200 text-sm space-y-1">
                  <li>• Prayer request submissions</li>
                  <li>• Testimony and life-change stories</li>
                  <li>• Community building indicators</li>
                </ul>
              </div>

              <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">📈</span> Growth Tracking
                </h3>
                <p class="text-orange-200 mb-3">
                  Monitor your channel's growth and identify successful content strategies.
                </p>
                <ul class="text-orange-200 text-sm space-y-1">
                  <li>• Subscriber growth patterns</li>
                  <li>• Content performance trends</li>
                  <li>• Revenue and monetization data</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2">📋 Getting Started</h3>
              <p class="text-yellow-200 mb-3">
                Analytics data becomes available 24-48 hours after content publication. Here's how to access and use it:
              </p>
              <ol class="text-yellow-200 text-sm space-y-1">
                <li>1. Navigate to Creator Dashboard → Analytics</li>
                <li>2. Select date range and content filters</li>
                <li>3. Review key metrics and identify trends</li>
                <li>4. Apply insights to optimize future content</li>
              </ol>
            </div>
          </div>

        {:else if activeSection === 'metrics'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Key Metrics Explained</h2>
              <p class="text-gray-300 mb-6">
                Understanding what each metric means and how it relates to your ministry goals.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Audience Metrics</h3>
                <div class="space-y-4">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">👥 Total Views</h4>
                    <p class="text-gray-300 text-sm mb-2">The number of times your content has been watched.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> Indicates your reach and how many people you're impacting with your message.</p>
                  </div>

                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">⏱️ Watch Time</h4>
                    <p class="text-gray-300 text-sm mb-2">Total minutes viewers have spent watching your content.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> Shows depth of engagement - people spending time with your ministry content.</p>
                  </div>

                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">📊 Average View Duration</h4>
                    <p class="text-gray-300 text-sm mb-2">How long viewers typically watch your videos.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> Indicates content quality and audience interest in your message.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Engagement Metrics</h3>
                <div class="space-y-4">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">❤️ Likes & Reactions</h4>
                    <p class="text-gray-300 text-sm mb-2">Positive responses to your content.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> Shows appreciation and spiritual encouragement from your audience.</p>
                  </div>

                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">💬 Comments</h4>
                    <p class="text-gray-300 text-sm mb-2">Viewer interactions and discussions on your content.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> Indicates community building and spiritual conversations happening.</p>
                  </div>

                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">🔄 Shares</h4>
                    <p class="text-gray-300 text-sm mb-2">How often viewers share your content with others.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> Shows evangelistic impact - people spreading your ministry message.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Growth Metrics</h3>
                <div class="space-y-4">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">📈 Subscriber Growth</h4>
                    <p class="text-gray-300 text-sm mb-2">New followers joining your ministry community.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> People committing to regular spiritual content from your ministry.</p>
                  </div>

                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">🎯 Click-Through Rate (CTR)</h4>
                    <p class="text-gray-300 text-sm mb-2">Percentage of people who click on your content after seeing it.</p>
                    <p class="text-purple-400 text-sm"><strong>Ministry Context:</strong> How compelling your titles and thumbnails are to potential viewers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'interpretation'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Data Interpretation</h2>
              <p class="text-gray-300 mb-6">
                Learn how to read your analytics data and apply insights to improve your ministry impact.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Understanding Audience Retention</h3>
                <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                  <h4 class="font-medium text-white mb-3">📊 Retention Graph Analysis</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="font-medium text-white mb-2">High Retention Indicators</h5>
                      <ul class="text-blue-200 text-sm space-y-1">
                        <li>• Gradual decline over time</li>
                        <li>• Spikes during key teaching moments</li>
                        <li>• Above 50% retention at midpoint</li>
                        <li>• Strong finish (many watch to end)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-white mb-2">Areas for Improvement</h5>
                      <ul class="text-blue-200 text-sm space-y-1">
                        <li>• Sharp drops in first 30 seconds</li>
                        <li>• Significant dips during transitions</li>
                        <li>• Low completion rates</li>
                        <li>• Consistent decline without engagement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Engagement Pattern Analysis</h3>
                <div class="space-y-4">
                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">✅ Positive Engagement Signals</h4>
                    <ul class="text-green-200 text-sm space-y-2">
                      <li>• <strong>High Like-to-View Ratio:</strong> Content resonates spiritually</li>
                      <li>• <strong>Meaningful Comments:</strong> Deep spiritual discussions</li>
                      <li>• <strong>Multiple Shares:</strong> Content inspires evangelism</li>
                      <li>• <strong>Return Viewers:</strong> Building loyal ministry community</li>
                    </ul>
                  </div>

                  <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">⚠️ Warning Signs</h4>
                    <ul class="text-yellow-200 text-sm space-y-2">
                      <li>• <strong>Low Engagement Rate:</strong> Content may not be connecting</li>
                      <li>• <strong>Negative Comments:</strong> Message may need clarification</li>
                      <li>• <strong>High Bounce Rate:</strong> Hook isn't strong enough</li>
                      <li>• <strong>Declining Subscribers:</strong> Content direction may need adjustment</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Demographic Insights</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-3">🌍 Geographic Data</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Identify global reach</li>
                        <li>• Plan content timing for audiences</li>
                        <li>• Consider cultural context</li>
                        <li>• Explore translation opportunities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">👥 Age Demographics</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Tailor content complexity</li>
                        <li>• Use age-appropriate references</li>
                        <li>• Address generational concerns</li>
                        <li>• Create targeted series</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">📱 Device Usage</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Optimize for mobile viewing</li>
                        <li>• Consider audio quality for mobile</li>
                        <li>• Adjust text size and visuals</li>
                        <li>• Plan for different screen sizes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'optimization'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Content Optimization</h2>
              <p class="text-gray-300 mb-6">
                Use analytics insights to improve your content and maximize your ministry impact.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Optimization Strategies</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🎯 Title & Thumbnail Optimization</h4>
                    <ul class="text-purple-200 text-sm space-y-2">
                      <li>• A/B test different title approaches</li>
                      <li>• Use emotional and spiritual language</li>
                      <li>• Include relevant Bible references</li>
                      <li>• Create compelling visual thumbnails</li>
                      <li>• Monitor CTR improvements</li>
                    </ul>
                  </div>

                  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">⏰ Timing Optimization</h4>
                    <ul class="text-blue-200 text-sm space-y-2">
                      <li>• Analyze when your audience is most active</li>
                      <li>• Consider global time zones</li>
                      <li>• Test different days of the week</li>
                      <li>• Align with spiritual seasons</li>
                      <li>• Schedule for maximum reach</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Content Format Optimization</h3>
                <div class="space-y-4">
                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📹 Video Length Optimization</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-medium text-white mb-2">Short-Form Content (2-8 minutes)</h5>
                        <ul class="text-green-200 text-sm space-y-1">
                          <li>• Daily devotionals</li>
                          <li>• Quick Bible verses</li>
                          <li>• Prayer moments</li>
                          <li>• Inspirational messages</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-medium text-white mb-2">Long-Form Content (15-45 minutes)</h5>
                        <ul class="text-green-200 text-sm space-y-1">
                          <li>• In-depth Bible studies</li>
                          <li>• Sermon teachings</li>
                          <li>• Life testimony stories</li>
                          <li>• Q&A sessions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🎨 Visual Optimization</h4>
                    <ul class="text-orange-200 text-sm space-y-2">
                      <li>• Use consistent branding across content</li>
                      <li>• Include Bible verse overlays for key points</li>
                      <li>• Add chapter markers for longer content</li>
                      <li>• Optimize thumbnails based on performance data</li>
                      <li>• Test different visual styles</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Engagement Optimization</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-3">💬 Comment Strategy</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Pin engaging questions</li>
                        <li>• Respond within first hour</li>
                        <li>• Ask for prayer requests</li>
                        <li>• Share personal insights</li>
                        <li>• Encourage testimony sharing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">🔄 Series Strategy</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Create connected content</li>
                        <li>• Build anticipation for next episode</li>
                        <li>• Use consistent series branding</li>
                        <li>• Track series performance</li>
                        <li>• Plan seasonal content</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'reporting'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Reports & Insights</h2>
              <p class="text-gray-300 mb-6">
                Generate and interpret detailed reports to track your ministry growth and impact.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Available Reports</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📊 Performance Dashboard</h4>
                    <p class="text-blue-200 mb-3">Overview of your channel's key metrics</p>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• Total views and watch time</li>
                      <li>• Subscriber growth trends</li>
                      <li>• Top-performing content</li>
                      <li>• Engagement rate summaries</li>
                    </ul>
                  </div>

                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">👥 Audience Report</h4>
                    <p class="text-green-200 mb-3">Detailed audience demographics and behavior</p>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Geographic distribution</li>
                      <li>• Age and device breakdowns</li>
                      <li>• Viewing time patterns</li>
                      <li>• Return visitor analysis</li>
                    </ul>
                  </div>

                  <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📹 Content Analysis</h4>
                    <p class="text-purple-200 mb-3">Deep dive into individual video performance</p>
                    <ul class="text-purple-200 text-sm space-y-1">
                      <li>• Retention curve analysis</li>
                      <li>• Engagement timeline</li>
                      <li>• Comment sentiment analysis</li>
                      <li>• Traffic source breakdown</li>
                    </ul>
                  </div>

                  <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">💰 Ministry Impact Report</h4>
                    <p class="text-orange-200 mb-3">Track spiritual and financial impact</p>
                    <ul class="text-orange-200 text-sm space-y-1">
                      <li>• Prayer request statistics</li>
                      <li>• Testimony submissions</li>
                      <li>• Donation and sponsorship data</li>
                      <li>• Community growth metrics</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Custom Report Building</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <h4 class="font-medium text-white mb-3">🔧 Report Customization Options</h4>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h5 class="font-medium text-white mb-2">Date Ranges</h5>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Last 7/30/90 days</li>
                        <li>• Custom date ranges</li>
                        <li>• Year-over-year comparisons</li>
                        <li>• Seasonal analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-white mb-2">Content Filters</h5>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Content type (sermons, testimonies)</li>
                        <li>• Series or individual videos</li>
                        <li>• Duration ranges</li>
                        <li>• Topic categories</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-white mb-2">Export Options</h5>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• PDF summary reports</li>
                        <li>• CSV data exports</li>
                        <li>• Shareable dashboards</li>
                        <li>• Automated email reports</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Monthly Ministry Review</h3>
                <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                  <h4 class="font-medium text-white mb-3">📅 Monthly Review Checklist</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="font-medium text-white mb-2">Growth Assessment</h5>
                      <ul class="text-yellow-200 text-sm space-y-1">
                        <li>□ Review subscriber growth</li>
                        <li>□ Analyze top-performing content</li>
                        <li>□ Check audience retention trends</li>
                        <li>□ Evaluate engagement rates</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-white mb-2">Ministry Impact</h5>
                      <ul class="text-yellow-200 text-sm space-y-1">
                        <li>□ Count prayer requests received</li>
                        <li>□ Review testimony submissions</li>
                        <li>□ Assess community interactions</li>
                        <li>□ Track spiritual conversations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'troubleshooting'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Analytics Troubleshooting</h2>
              <p class="text-gray-300 mb-6">
                Common analytics issues and how to resolve them.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Data Issues</h3>
                <div class="space-y-4">
                  <div class="bg-red-600/20 border border-red-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">❌ No Data Showing</h4>
                    <p class="text-red-200 mb-2">If your analytics aren't displaying data:</p>
                    <ul class="text-red-200 text-sm space-y-1">
                      <li>• Wait 24-48 hours after content publication</li>
                      <li>• Check if content is set to public</li>
                      <li>• Verify your creator account is approved</li>
                      <li>• Clear browser cache and refresh</li>
                      <li>• Try accessing from different browser</li>
                    </ul>
                  </div>

                  <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">⚠️ Delayed Data Updates</h4>
                    <p class="text-yellow-200 mb-2">Analytics updates may be delayed due to:</p>
                    <ul class="text-yellow-200 text-sm space-y-1">
                      <li>• Normal processing lag (24-48 hours)</li>
                      <li>• High platform traffic periods</li>
                      <li>• Weekend/holiday processing delays</li>
                      <li>• System maintenance windows</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Interpretation Problems</h3>
                <div class="space-y-4">
                  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📊 Sudden Metric Changes</h4>
                    <p class="text-blue-200 mb-2">If you see unexpected changes in metrics:</p>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• Check if content was featured or shared widely</li>
                      <li>• Review recent algorithm or platform changes</li>
                      <li>• Look for external traffic sources</li>
                      <li>• Compare with similar timeframes</li>
                      <li>• Consider seasonal or event-related impacts</li>
                    </ul>
                  </div>

                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📈 Low Engagement Despite High Views</h4>
                    <p class="text-green-200 mb-2">This often indicates:</p>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Content doesn't match audience expectations</li>
                      <li>• Poor audio/video quality affecting retention</li>
                      <li>• Weak call-to-action or engagement prompts</li>
                      <li>• Audience mismatch with content type</li>
                      <li>• Need for more interactive content elements</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Technical Issues</h3>
                <div class="space-y-4">
                  <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🔧 Dashboard Loading Problems</h4>
                    <p class="text-purple-200 mb-2">If analytics dashboard won't load:</p>
                    <ul class="text-purple-200 text-sm space-y-1">
                      <li>• Check internet connection stability</li>
                      <li>• Disable browser extensions temporarily</li>
                      <li>• Try incognito/private browsing mode</li>
                      <li>• Update browser to latest version</li>
                      <li>• Contact support if issue persists</li>
                    </ul>
                  </div>

                  <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📱 Mobile Analytics Issues</h4>
                    <p class="text-orange-200 mb-2">For mobile app analytics problems:</p>
                    <ul class="text-orange-200 text-sm space-y-1">
                      <li>• Update app to latest version</li>
                      <li>• Clear app cache and data</li>
                      <li>• Restart device and reopen app</li>
                      <li>• Check mobile data/WiFi connection</li>
                      <li>• Use web browser as alternative</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-gray-600/20 border border-gray-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2">🆘 Still Need Help?</h3>
                <p class="text-gray-200 mb-3">
                  If you're still experiencing issues with analytics, our support team is here to help.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="/creator/support" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-center">
                    Contact Support
                  </a>
                  <a href="/creator/forum" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center">
                    Ask Community
                  </a>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>