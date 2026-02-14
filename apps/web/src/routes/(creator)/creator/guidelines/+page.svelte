<!-- Creator Guidelines -->
<script lang="ts">
  let activeSection = 'overview';
  
  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'content', title: 'Content Standards', icon: '🎬' },
    { id: 'technical', title: 'Technical Requirements', icon: '⚙️' },
    { id: 'submission', title: 'Submission Process', icon: '📤' },
    { id: 'review', title: 'Review Process', icon: '👁️' },
    { id: 'best-practices', title: 'Best Practices', icon: '⭐' }
  ];
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Guidelines</h1>
    <p class="text-gray-300">Everything you need to know about creating content for Sephar Studios</p>
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
              <h2 class="text-2xl font-bold text-white mb-4">Welcome to Sephar Studios</h2>
              <p class="text-gray-300 mb-4">
                Sephar Studios is a faith-based streaming platform dedicated to sharing Christian content that inspires, 
                educates, and transforms lives. As a creator, you play a vital role in building a community centered around 
                faith, hope, and love.
              </p>
            </div>

            <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">🎯</span> Our Mission
              </h3>
              <p class="text-blue-200">
                To provide a safe, inspiring platform where Christian creators can share their God-given talents 
                and stories to reach hearts worldwide with the message of Jesus Christ.
              </p>
            </div>

            <div>
              <h3 class="text-xl font-bold text-white mb-4">Core Values</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2">🙏 Faith-Centered</div>
                  <p class="text-gray-300 text-sm">All content should reflect Christian values and biblical principles.</p>
                </div>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2">👨‍👩‍👧‍👦 Family-Friendly</div>
                  <p class="text-gray-300 text-sm">Content should be appropriate for viewers of all ages in the family.</p>
                </div>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2">⚡ High-Quality</div>
                  <p class="text-gray-300 text-sm">We maintain high standards for both content quality and technical excellence.</p>
                </div>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2">🌍 Global Impact</div>
                  <p class="text-gray-300 text-sm">Content that reaches and transforms lives across cultures and communities.</p>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'content'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Content Standards</h2>
              <p class="text-gray-300 mb-6">
                All content submitted to Sephar Studios must align with our faith-based values and community standards.
              </p>
            </div>

            <div class="space-y-4">
              <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">✅</span> Required Content Standards
                </h3>
                <ul class="space-y-2 text-green-200">
                  <li class="flex items-start"><span class="mr-2">•</span> Aligns with core Christian beliefs and biblical teachings</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Promotes positive Christian values and morals</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Appropriate for family viewing (unless clearly marked otherwise)</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Respectful of different denominations within Christianity</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Educational, inspirational, or worship-focused content</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Original content or properly licensed material</li>
                </ul>
              </div>

              <div class="bg-red-600/20 border border-red-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">❌</span> Prohibited Content
                </h3>
                <ul class="space-y-2 text-red-200">
                  <li class="flex items-start"><span class="mr-2">•</span> Profanity, vulgar language, or inappropriate humor</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Violence, graphic imagery, or disturbing content</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Sexual content, nudity, or suggestive material</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Hate speech, discrimination, or divisive rhetoric</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Content promoting other religions or anti-Christian views</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Political endorsements or controversial social stances</li>
                  <li class="flex items-start"><span class="mr-2">•</span> Commercial advertising or promotional material</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-bold text-white mb-4">Content Categories</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2 flex items-center">
                    <span class="mr-2">🎬</span> Movies & Documentaries
                  </div>
                  <p class="text-gray-300 text-sm">Feature-length films, documentaries, and biographical content with Christian themes.</p>
                </div>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2 flex items-center">
                    <span class="mr-2">⛪</span> Sermons & Teaching
                  </div>
                  <p class="text-gray-300 text-sm">Biblical teaching, sermons, and educational content from qualified ministers.</p>
                </div>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2 flex items-center">
                    <span class="mr-2">🎵</span> Worship & Music
                  </div>
                  <p class="text-gray-300 text-sm">Christian music, worship services, and musical performances.</p>
                </div>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="text-lg font-medium text-white mb-2 flex items-center">
                    <span class="mr-2">🧸</span> Children's Content
                  </div>
                  <p class="text-gray-300 text-sm">Age-appropriate content designed specifically for children and families.</p>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'technical'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Technical Requirements</h2>
              <p class="text-gray-300 mb-6">
                To ensure the best viewing experience, all content must meet our technical standards.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-4">Video Specifications</h3>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-2">Resolution & Quality</h4>
                      <ul class="space-y-1 text-gray-300 text-sm">
                        <li>• <strong>Minimum:</strong> 720p HD (1280x720)</li>
                        <li>• <strong>Recommended:</strong> 1080p Full HD (1920x1080)</li>
                        <li>• <strong>Maximum:</strong> 4K UHD (3840x2160)</li>
                        <li>• Aspect Ratio: 16:9 (standard)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-2">Format & Compression</h4>
                      <ul class="space-y-1 text-gray-300 text-sm">
                        <li>• <strong>Format:</strong> MP4 (H.264/H.265)</li>
                        <li>• <strong>Bitrate:</strong> 5-25 Mbps (depending on resolution)</li>
                        <li>• <strong>Frame Rate:</strong> 24, 25, or 30 fps</li>
                        <li>• <strong>Maximum Size:</strong> 5GB per file</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Audio Specifications</h3>
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-medium text-white mb-2">Audio Quality</h4>
                      <ul class="space-y-1 text-gray-300 text-sm">
                        <li>• <strong>Format:</strong> AAC or MP3</li>
                        <li>• <strong>Sample Rate:</strong> 44.1 kHz or 48 kHz</li>
                        <li>• <strong>Bit Depth:</strong> 16-bit minimum</li>
                        <li>• <strong>Channels:</strong> Stereo preferred</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-white mb-2">Audio Standards</h4>
                      <ul class="space-y-1 text-gray-300 text-sm">
                        <li>• Clear, professional-quality recording</li>
                        <li>• Minimal background noise</li>
                        <li>• Consistent audio levels throughout</li>
                        <li>• Proper synchronization with video</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-white mb-4">Image Assets Requirements</h3>
                <div class="space-y-4">
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">Required Assets</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-purple-400 font-medium">Portrait Poster (2:3)</p>
                        <p class="text-gray-300">Minimum: 400x600px</p>
                        <p class="text-gray-300">Recommended: 800x1200px</p>
                      </div>
                      <div>
                        <p class="text-purple-400 font-medium">Hero Background (16:9)</p>
                        <p class="text-gray-300">Minimum: 1920x1080px</p>
                        <p class="text-gray-300">Recommended: 3840x2160px</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white/5 rounded-lg p-4">
                    <h4 class="font-medium text-white mb-2">Optional Assets</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p class="text-blue-400 font-medium">Square Poster (1:1)</p>
                        <p class="text-gray-300">400x400px - 800x800px</p>
                      </div>
                      <div>
                        <p class="text-blue-400 font-medium">Landscape Poster (16:9)</p>
                        <p class="text-gray-300">800x450px - 1600x900px</p>
                      </div>
                      <div>
                        <p class="text-blue-400 font-medium">Title Logo (PNG)</p>
                        <p class="text-gray-300">Transparent background</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'submission'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Submission Process</h2>
              <p class="text-gray-300 mb-6">
                Follow our step-by-step submission process to get your content reviewed and published.
              </p>
            </div>

            <div class="space-y-4">
              {#each [
                { step: 1, title: 'Basic Information', desc: 'Provide title, description, content type, and age rating', icon: '📝' },
                { step: 2, title: 'Video Upload', desc: 'Upload your main video file and optional trailer', icon: '📹' },
                { step: 3, title: 'Image Assets', desc: 'Upload posters and background images', icon: '🖼️' },
                { step: 4, title: 'Metadata', desc: 'Add Bible references, themes, tags, and keywords', icon: '📚' },
                { step: 5, title: 'Review & Submit', desc: 'Review all information and submit for approval', icon: '✅' }
              ] as item}
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="flex items-start space-x-4">
                    <div class="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <span class="text-xl">{item.icon}</span>
                        <h3 class="text-lg font-medium text-white">{item.title}</h3>
                      </div>
                      <p class="text-gray-300">{item.desc}</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">💡</span> Submission Tips
              </h3>
              <ul class="space-y-1 text-yellow-200 text-sm">
                <li>• Complete all required fields to avoid delays in review</li>
                <li>• Use descriptive titles and detailed descriptions</li>
                <li>• Include relevant Bible references and themes</li>
                <li>• Ensure all uploaded files meet technical requirements</li>
                <li>• Double-check content for alignment with our standards</li>
              </ul>
            </div>
          </div>

        {:else if activeSection === 'review'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Review Process</h2>
              <p class="text-gray-300 mb-6">
                Understanding our multi-stage review process helps ensure faster approval.
              </p>
            </div>

            <div class="space-y-4">
              {#each [
                { stage: 'Theological Review', desc: 'Content is reviewed for biblical accuracy and doctrinal alignment', icon: '📖', color: 'purple' },
                { stage: 'Content Moderation', desc: 'General content review for appropriateness and quality standards', icon: '👁️', color: 'blue' },
                { stage: 'Technical QA', desc: 'Video and audio quality, file format, and technical specifications check', icon: '⚙️', color: 'green' },
                { stage: 'Final Approval', desc: 'Content is approved and scheduled for publication', icon: '✅', color: 'emerald' }
              ] as stage}
                <div class="bg-white/5 rounded-lg p-4">
                  <div class="flex items-start space-x-4">
                    <div class="bg-{stage.color}-600 rounded-full w-12 h-12 flex items-center justify-center text-white text-xl">
                      {stage.icon}
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-white mb-2">{stage.stage}</h3>
                      <p class="text-gray-300">{stage.desc}</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">⏱️</span> Review Timeline
              </h3>
              <div class="text-blue-200 space-y-1">
                <p><strong>Expected Review Time:</strong> 3-5 business days</p>
                <p><strong>Expedited Review:</strong> Available for time-sensitive content</p>
                <p><strong>Status Updates:</strong> Email notifications at each stage</p>
                <p><strong>Resubmission:</strong> 1-2 business days for revised content</p>
              </div>
            </div>

            <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">🚀</span> After Approval
              </h3>
              <ul class="space-y-1 text-green-200 text-sm">
                <li>• Content goes live on the platform immediately after approval</li>
                <li>• You'll receive a confirmation email with the published content link</li>
                <li>• Analytics become available within 24 hours of publication</li>
                <li>• Content is distributed across all platform devices and regions</li>
              </ul>
            </div>
          </div>

        {:else if activeSection === 'best-practices'}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-4">Best Practices</h2>
              <p class="text-gray-300 mb-6">
                Follow these best practices to maximize your content's impact and engagement.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                  <span class="mr-2">🎯</span> Content Strategy
                </h3>
                <ul class="space-y-2 text-gray-300 text-sm">
                  <li>• Focus on clear, biblical messaging</li>
                  <li>• Tell compelling, personal stories</li>
                  <li>• Address real-life challenges and solutions</li>
                  <li>• Create series for deeper engagement</li>
                  <li>• Include practical applications</li>
                </ul>
              </div>

              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                  <span class="mr-2">📱</span> Mobile Optimization
                </h3>
                <ul class="space-y-2 text-gray-300 text-sm">
                  <li>• Ensure text is readable on small screens</li>
                  <li>• Use clear, high-contrast visuals</li>
                  <li>• Test audio quality with mobile speakers</li>
                  <li>• Keep important elements center-framed</li>
                  <li>• Consider vertical video for mobile</li>
                </ul>
              </div>

              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                  <span class="mr-2">🎨</span> Visual Excellence
                </h3>
                <ul class="space-y-2 text-gray-300 text-sm">
                  <li>• Use professional lighting and composition</li>
                  <li>• Maintain consistent branding</li>
                  <li>• Create eye-catching thumbnails</li>
                  <li>• Use appropriate color schemes</li>
                  <li>• Include captions for accessibility</li>
                </ul>
              </div>

              <div class="bg-white/5 rounded-lg p-6">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                  <span class="mr-2">📊</span> Engagement Tips
                </h3>
                <ul class="space-y-2 text-gray-300 text-sm">
                  <li>• Hook viewers in the first 15 seconds</li>
                  <li>• Use relevant Bible verses and quotes</li>
                  <li>• Encourage community discussion</li>
                  <li>• Provide clear calls-to-action</li>
                  <li>• Regular, consistent publishing schedule</li>
                </ul>
              </div>
            </div>

            <div class="bg-purple-600/20 border border-purple-600 rounded-lg p-4">
              <h3 class="text-lg font-bold text-white mb-2 flex items-center">
                <span class="mr-2">🏆</span> Success Metrics
              </h3>
              <p class="text-purple-200 mb-3">
                Focus on these key metrics to measure your content's spiritual impact:
              </p>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div class="text-center">
                  <div class="text-xl mb-1">👁️</div>
                  <div class="text-purple-200">Watch Completion</div>
                </div>
                <div class="text-center">
                  <div class="text-xl mb-1">❤️</div>
                  <div class="text-purple-200">Engagement Rate</div>
                </div>
                <div class="text-center">
                  <div class="text-xl mb-1">🔄</div>
                  <div class="text-purple-200">Shares & Saves</div>
                </div>
                <div class="text-center">
                  <div class="text-xl mb-1">💬</div>
                  <div class="text-purple-200">Community Response</div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>