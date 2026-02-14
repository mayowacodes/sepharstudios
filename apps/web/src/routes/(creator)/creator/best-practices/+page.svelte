<!-- Creator Best Practices -->
<script lang="ts">
  let activeSection = 'overview';

  const sections = [
    { id: 'overview', title: 'Overview', icon: '🎯' },
    { id: 'content-strategy', title: 'Content Strategy', icon: '📝' },
    { id: 'production', title: 'Production Quality', icon: '🎬' },
    { id: 'engagement', title: 'Audience Engagement', icon: '❤️' },
    { id: 'growth', title: 'Channel Growth', icon: '📈' },
    { id: 'ministry', title: 'Ministry Impact', icon: '✝️' }
  ];
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Best Practices</h1>
    <p class="text-gray-300">Proven strategies to maximize your ministry impact and grow your audience</p>
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
              <h2 class="text-2xl font-bold text-white mb-4">Best Practices Overview</h2>
              <p class="text-gray-300 mb-4">
                Creating successful faith-based content requires more than just good intentions. These proven strategies
                will help you maximize your ministry impact and build a thriving creator community.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">🎯</span> Purpose-Driven Content
                </h3>
                <p class="text-blue-200 mb-3">
                  Every piece of content should have a clear ministry purpose and call to action.
                </p>
                <ul class="text-blue-200 text-sm space-y-1">
                  <li>• Define your ministry focus</li>
                  <li>• Set clear content goals</li>
                  <li>• Include actionable takeaways</li>
                </ul>
              </div>

              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">⚡</span> Consistent Excellence
                </h3>
                <p class="text-green-200 mb-3">
                  Maintain high standards across all aspects of your content creation.
                </p>
                <ul class="text-green-200 text-sm space-y-1">
                  <li>• Regular upload schedule</li>
                  <li>• Professional presentation</li>
                  <li>• Engaging storytelling</li>
                </ul>
              </div>

              <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">👥</span> Community Building
                </h3>
                <p class="text-purple-200 mb-3">
                  Foster genuine connections and build a supportive faith community.
                </p>
                <ul class="text-purple-200 text-sm space-y-1">
                  <li>• Respond to comments thoughtfully</li>
                  <li>• Create discussion opportunities</li>
                  <li>• Share personal experiences</li>
                </ul>
              </div>

              <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">📊</span> Data-Driven Growth
                </h3>
                <p class="text-orange-200 mb-3">
                  Use analytics to understand your audience and improve your content.
                </p>
                <ul class="text-orange-200 text-sm space-y-1">
                  <li>• Track engagement metrics</li>
                  <li>• Analyze successful content</li>
                  <li>• Test different approaches</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">🏆</span> Success Metrics That Matter
              </h3>
              <p class="text-yellow-200 mb-3">
                Focus on metrics that reflect your ministry impact, not just vanity numbers.
              </p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div class="text-center">
                  <div class="text-2xl mb-1">💬</div>
                  <div class="text-yellow-200">Meaningful Comments</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl mb-1">🔄</div>
                  <div class="text-yellow-200">Content Shares</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl mb-1">⏱️</div>
                  <div class="text-yellow-200">Watch Time</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl mb-1">📧</div>
                  <div class="text-yellow-200">Newsletter Signups</div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'content-strategy'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Content Strategy</h2>
              <p class="text-gray-300 mb-6">
                Develop a strategic approach to content creation that serves your ministry goals and audience needs.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Content Planning Framework</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-3 flex items-center">
                        <span class="mr-2">🎯</span> Ministry Goals
                      </h4>
                      <ul class="space-y-2 text-gray-300 text-sm">
                        <li>• Evangelism and outreach</li>
                        <li>• Discipleship and growth</li>
                        <li>• Community building</li>
                        <li>• Biblical education</li>
                        <li>• Worship and inspiration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3 flex items-center">
                        <span class="mr-2">👥</span> Audience Needs
                      </h4>
                      <ul class="space-y-2 text-gray-300 text-sm">
                        <li>• Spiritual encouragement</li>
                        <li>• Practical life application</li>
                        <li>• Biblical answers to questions</li>
                        <li>• Community connection</li>
                        <li>• Worship experiences</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3 flex items-center">
                        <span class="mr-2">📝</span> Content Types
                      </h4>
                      <ul class="space-y-2 text-gray-300 text-sm">
                        <li>• Teaching series</li>
                        <li>• Testimony videos</li>
                        <li>• Q&A sessions</li>
                        <li>• Behind-the-scenes</li>
                        <li>• Live worship/prayer</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Content Calendar Best Practices</h3>
                <div class="space-y-4">
                  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">📅 Plan Around Church Calendar</h4>
                    <p class="text-blue-200 mb-2">Align content with liturgical seasons and holidays:</p>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• Advent and Christmas content</li>
                      <li>• Lent and Easter series</li>
                      <li>• Back-to-school spiritual preparation</li>
                      <li>• Thanksgiving and gratitude themes</li>
                    </ul>
                  </div>

                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">🔄 Content Pillars Strategy</h4>
                    <p class="text-green-200 mb-2">Maintain variety with consistent themes:</p>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• 40% Biblical teaching and sermons</li>
                      <li>• 20% Personal testimony and stories</li>
                      <li>• 20% Practical Christian living</li>
                      <li>• 20% Community and worship content</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Storytelling for Ministry</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-3">🎬 Video Structure</h4>
                      <ol class="space-y-2 text-gray-300 text-sm">
                        <li>1. <strong>Hook (0-15 seconds):</strong> Compelling opening</li>
                        <li>2. <strong>Context (15-60 seconds):</strong> Set the scene</li>
                        <li>3. <strong>Core Content (60-90%):</strong> Main message</li>
                        <li>4. <strong>Application (5-10%):</strong> Practical takeaways</li>
                        <li>5. <strong>Call to Action:</strong> Clear next steps</li>
                      </ol>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">💡 Engagement Techniques</h4>
                      <ul class="space-y-2 text-gray-300 text-sm">
                        <li>• Ask questions throughout</li>
                        <li>• Share personal vulnerabilities</li>
                        <li>• Use relevant analogies</li>
                        <li>• Include viewer challenges</li>
                        <li>• Create series cliffhangers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'production'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Production Quality</h2>
              <p class="text-gray-300 mb-6">
                Technical excellence serves your ministry message and keeps viewers engaged.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Visual Excellence</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="font-medium text-white mb-3 flex items-center">
                      <span class="mr-2">💡</span> Lighting Setup
                    </h4>
                    <ul class="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>Key Light:</strong> Main light source on your face</li>
                      <li>• <strong>Fill Light:</strong> Soften shadows</li>
                      <li>• <strong>Natural Light:</strong> Face a window when possible</li>
                      <li>• <strong>Avoid:</strong> Overhead lighting, backlighting</li>
                      <li>• <strong>Budget Option:</strong> LED ring light</li>
                    </ul>
                  </div>

                  <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="font-medium text-white mb-3 flex items-center">
                      <span class="mr-2">📷</span> Camera Positioning
                    </h4>
                    <ul class="space-y-2 text-gray-300 text-sm">
                      <li>• <strong>Eye Level:</strong> Camera at your eye height</li>
                      <li>• <strong>Rule of Thirds:</strong> Position yourself offset</li>
                      <li>• <strong>Stable Shot:</strong> Use tripod or stable surface</li>
                      <li>• <strong>Background:</strong> Simple, uncluttered</li>
                      <li>• <strong>Framing:</strong> Leave headroom, show shoulders</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Audio Excellence</h3>
                <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                  <h4 class="font-medium text-white mb-3">🎙️ Audio is Critical</h4>
                  <p class="text-blue-200 mb-3">
                    Viewers will forgive poor video quality, but not poor audio. Invest in good sound equipment.
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="font-medium text-white mb-2">Equipment Options</h5>
                      <ul class="text-blue-200 text-sm space-y-1">
                        <li>• <strong>Budget:</strong> Lavalier/lapel microphone</li>
                        <li>• <strong>Mid-range:</strong> USB condenser mic</li>
                        <li>• <strong>Professional:</strong> Shotgun microphone</li>
                        <li>• <strong>Wireless:</strong> For movement flexibility</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-white mb-2">Recording Tips</h5>
                      <ul class="text-blue-200 text-sm space-y-1">
                        <li>• Record in quiet environment</li>
                        <li>• Use carpet/soft furnishings for acoustics</li>
                        <li>• Test levels before recording</li>
                        <li>• Monitor audio with headphones</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Post-Production Workflow</h3>
                <div class="space-y-4">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">✂️ Editing Best Practices</h4>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Cut out "umms," long pauses, and mistakes</li>
                      <li>• Add lower thirds for Bible verses or key points</li>
                      <li>• Use smooth transitions between segments</li>
                      <li>• Include engaging thumbnail and title cards</li>
                      <li>• Add background music where appropriate (low volume)</li>
                    </ul>
                  </div>

                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">🎨 Visual Elements</h4>
                    <ul class="text-gray-300 text-sm space-y-1">
                      <li>• Consistent color scheme and fonts</li>
                      <li>• Your ministry logo/branding</li>
                      <li>• Bible verse overlays for key teachings</li>
                      <li>• Chapter markers for longer content</li>
                      <li>• End screen with next video recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'engagement'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Audience Engagement</h2>
              <p class="text-gray-300 mb-6">
                Build meaningful connections with your audience to create a thriving ministry community.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Community Building Strategies</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">💬 Comment Engagement</h4>
                    <ul class="text-green-200 text-sm space-y-2">
                      <li>• Respond to comments within 24 hours</li>
                      <li>• Ask follow-up questions</li>
                      <li>• Acknowledge personal shares and testimonies</li>
                      <li>• Pin important or encouraging comments</li>
                      <li>• Create comment-response videos for complex questions</li>
                    </ul>
                  </div>

                  <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🤝 Community Features</h4>
                    <ul class="text-purple-200 text-sm space-y-2">
                      <li>• Weekly prayer request threads</li>
                      <li>• Live Q&A sessions</li>
                      <li>• Behind-the-scenes content</li>
                      <li>• Viewer testimony features</li>
                      <li>• Interactive Bible study groups</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Content Interaction Techniques</h3>
                <div class="space-y-4">
                  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🎯 Call-to-Action Examples</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-medium text-white mb-2">During Content</h5>
                        <ul class="text-blue-200 text-sm space-y-1">
                          <li>• "What's your experience with this?"</li>
                          <li>• "Drop your prayer requests below"</li>
                          <li>• "Share your testimony in the comments"</li>
                          <li>• "What questions do you have?"</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-medium text-white mb-2">End of Content</h5>
                        <ul class="text-blue-200 text-sm space-y-1">
                          <li>• "Subscribe for weekly encouragement"</li>
                          <li>• "Share this with someone who needs it"</li>
                          <li>• "Join our prayer community"</li>
                          <li>• "Download the study guide"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📱 Cross-Platform Engagement</h4>
                    <ul class="text-orange-200 text-sm space-y-2">
                      <li>• Share content teasers on social media</li>
                      <li>• Create discussion threads in Creator Forum</li>
                      <li>• Send newsletter updates with exclusive content</li>
                      <li>• Host live streams for real-time interaction</li>
                      <li>• Create downloadable resources (study guides, devotionals)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Building Viewer Loyalty</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-3">🔄 Consistency</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Regular upload schedule</li>
                        <li>• Consistent messaging and values</li>
                        <li>• Reliable quality standards</li>
                        <li>• Predictable content themes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">❤️ Authenticity</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Share personal struggles</li>
                        <li>• Admit when you don't know</li>
                        <li>• Show genuine emotion</li>
                        <li>• Be transparent about journey</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">🎁 Value</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Practical life applications</li>
                        <li>• Actionable spiritual advice</li>
                        <li>• Exclusive resources and content</li>
                        <li>• Personal prayer and support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'growth'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Channel Growth</h2>
              <p class="text-gray-300 mb-6">
                Sustainable growth strategies that align with your ministry goals and values.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Organic Growth Strategies</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🎯 SEO for Ministry Content</h4>
                    <ul class="text-green-200 text-sm space-y-2">
                      <li>• Use descriptive, searchable titles</li>
                      <li>• Include relevant Bible verses in descriptions</li>
                      <li>• Add topic-specific tags and keywords</li>
                      <li>• Create compelling thumbnails with text overlay</li>
                      <li>• Optimize for mobile viewing</li>
                    </ul>
                  </div>

                  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🤝 Collaboration Opportunities</h4>
                    <ul class="text-blue-200 text-sm space-y-2">
                      <li>• Guest appearances on other channels</li>
                      <li>• Cross-promotion with fellow creators</li>
                      <li>• Joint Bible study series</li>
                      <li>• Testimony exchange programs</li>
                      <li>• Ministry event partnerships</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Content Series Strategy</h3>
                <div class="space-y-4">
                  <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📚 Series Ideas That Work</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-medium text-white mb-2">Teaching Series</h5>
                        <ul class="text-purple-200 text-sm space-y-1">
                          <li>• "30 Days of Faith"</li>
                          <li>• "Bible Characters & You"</li>
                          <li>• "Overcoming Life's Challenges"</li>
                          <li>• "Practical Christianity"</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-medium text-white mb-2">Interactive Series</h5>
                        <ul class="text-purple-200 text-sm space-y-1">
                          <li>• "Your Questions Answered"</li>
                          <li>• "Viewer Testimony Spotlight"</li>
                          <li>• "Prayer Request Follow-ups"</li>
                          <li>• "Biblical Life Advice"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">⏰ Series Timing Tips</h4>
                    <ul class="text-yellow-200 text-sm space-y-2">
                      <li>• Plan 4-6 episodes minimum for momentum</li>
                      <li>• Release consistently (weekly works best)</li>
                      <li>• Create anticipation with series trailers</li>
                      <li>• End episodes with next week's preview</li>
                      <li>• Compile series into playlists for easy discovery</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Analytics-Driven Growth</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-3">📊 Key Metrics</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Watch time and retention</li>
                        <li>• Click-through rates</li>
                        <li>• Engagement rates</li>
                        <li>• Subscriber growth rate</li>
                        <li>• Comment sentiment</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">🔍 Content Analysis</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Identify top-performing topics</li>
                        <li>• Analyze drop-off points</li>
                        <li>• Track seasonal trends</li>
                        <li>• Monitor audience demographics</li>
                        <li>• Study successful competitors</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">⚡ Optimization Actions</h4>
                      <ul class="text-gray-300 text-sm space-y-1">
                        <li>• Double down on successful formats</li>
                        <li>• Improve underperforming content</li>
                        <li>• Test different upload times</li>
                        <li>• Experiment with thumbnails</li>
                        <li>• Refine content based on feedback</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'ministry'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Ministry Impact</h2>
              <p class="text-gray-300 mb-6">
                Maximize the spiritual impact of your content and build meaningful ministry connections.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Measuring Ministry Success</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">📈 Spiritual Metrics</h4>
                    <p class="text-blue-200 mb-3">Look beyond views to measure real impact:</p>
                    <ul class="text-blue-200 text-sm space-y-1">
                      <li>• Testimony submissions</li>
                      <li>• Life-change stories</li>
                      <li>• Prayer request responses</li>
                      <li>• Bible study participation</li>
                      <li>• Community involvement growth</li>
                    </ul>
                  </div>

                  <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">💝 Community Outcomes</h4>
                    <p class="text-green-200 mb-3">Track how your content builds community:</p>
                    <ul class="text-green-200 text-sm space-y-1">
                      <li>• Supportive comment interactions</li>
                      <li>• Members helping each other</li>
                      <li>• Local ministry connections</li>
                      <li>• Offline community formation</li>
                      <li>• Spiritual mentorship relationships</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Spiritual Content Guidelines</h3>
                <div class="space-y-4">
                  <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">✝️ Christ-Centered Focus</h4>
                    <ul class="text-purple-200 text-sm space-y-2">
                      <li>• Always point viewers to Jesus</li>
                      <li>• Include Gospel message in content</li>
                      <li>• Share how Scripture applies to real life</li>
                      <li>• Encourage personal relationship with God</li>
                      <li>• Provide clear next steps for spiritual growth</li>
                    </ul>
                  </div>

                  <div class="bg-orange-600/20 border border-orange-600 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-3">🙏 Prayer and Ministry Integration</h4>
                    <ul class="text-orange-200 text-sm space-y-2">
                      <li>• Begin and end videos with prayer</li>
                      <li>• Create dedicated prayer content</li>
                      <li>• Respond to prayer requests personally</li>
                      <li>• Share answered prayer testimonies</li>
                      <li>• Offer spiritual counseling resources</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Long-term Ministry Vision</h3>
                <div class="bg-white/5 rounded-lg p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-3">🌱 Discipleship Focus</h4>
                      <ul class="text-gray-300 text-sm space-y-2">
                        <li>• Create progressive learning paths</li>
                        <li>• Offer deep Bible study series</li>
                        <li>• Mentor emerging creators</li>
                        <li>• Build accountability partnerships</li>
                        <li>• Provide resources for spiritual growth</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-3">🌍 Kingdom Impact</h4>
                      <ul class="text-gray-300 text-sm space-y-2">
                        <li>• Partner with global ministries</li>
                        <li>• Support missionary work</li>
                        <li>• Address social justice issues</li>
                        <li>• Encourage local church involvement</li>
                        <li>• Raise funds for ministry projects</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                  <span class="mr-2">🎯</span> Action Steps for Ministry Impact
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 class="font-medium text-white mb-2">This Week</h5>
                    <ul class="text-yellow-200 space-y-1">
                      <li>• Pray for your viewers by name</li>
                      <li>• Respond to every comment with care</li>
                      <li>• Create one piece of encouraging content</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="font-medium text-white mb-2">This Month</h5>
                    <ul class="text-yellow-200 space-y-1">
                      <li>• Start a Bible study series</li>
                      <li>• Feature viewer testimonies</li>
                      <li>• Connect with local ministry</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>