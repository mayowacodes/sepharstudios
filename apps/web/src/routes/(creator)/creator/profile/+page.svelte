<!-- Creator Profile Management -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  // Profile form data
  let profileData = {
    creatorType: 'individual',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      profileImage: ''
    },
    ministryInfo: {
      ministryName: '',
      ministryWebsite: '',
      denomination: '',
      yearsInMinistry: '',
      ministryDescription: '',
      ministryAddress: '',
      isVerified: false,
      verificationDocuments: [] as Array<{ id: string; url: string; name: string; size?: number } | string>
    },
    socialLinks: {
      youtube: '',
      facebook: '',
      instagram: '',
      twitter: '',
      website: '',
      podcast: ''
    },
    preferences: {
      publicProfile: true,
      emailNotifications: true,
      reviewNotifications: true,
      marketingEmails: false,
      showContactInfo: false
    }
  };
  
  let isLoading = true;
  let isSaving = false;
  let saveStatus = '';
  let activeTab = 'personal';
  
  onMount(async () => {
    isLoading = true;
    try {
      const res = await fetch('/api/creator/profile');
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      if (data?.profile) {
        profileData = data.profile;
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      isLoading = false;
    }
  });
  
  async function saveProfile() {
    isSaving = true;
    saveStatus = '';
    
    try {
      const res = await fetch('/api/creator/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (!res.ok) throw new Error('Failed to save profile');
      
      saveStatus = 'success';
      setTimeout(() => saveStatus = '', 3000);
    } catch (error) {
      saveStatus = 'error';
      setTimeout(() => saveStatus = '', 3000);
    } finally {
      isSaving = false;
    }
  }
  
  function handleFileUpload(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Here you would upload the file to your storage service
      console.log(`Uploading ${type}:`, file.name);
      
      if (type === 'profile') {
        // Create temporary URL for preview
        profileData.personalInfo.profileImage = URL.createObjectURL(file);
      }
    }
  }
  
  function addVerificationDocument() {
    // Placeholder until document upload is wired to storage
    const fileName = `verification-doc-${Date.now()}.pdf`;
    profileData.ministryInfo.verificationDocuments = [
      ...profileData.ministryInfo.verificationDocuments,
      { id: fileName, url: fileName, name: fileName }
    ];
  }
  
  function removeVerificationDocument(index: number) {
    profileData.ministryInfo.verificationDocuments = 
      profileData.ministryInfo.verificationDocuments.filter((_, i) => i !== index);
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Creator Profile</h1>
      <p class="text-gray-300">Manage your profile and ministry information</p>
    </div>
    
    <!-- Save Button -->
    <div class="mt-4 sm:mt-0">
      <button 
        onclick={saveProfile}
        disabled={isSaving}
        class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
      >
        {#if isSaving}
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Saving...
        {:else}
          💾 Save Changes
        {/if}
      </button>
    </div>
  </div>

  <!-- Save Status -->
  {#if saveStatus === 'success'}
    <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">
      <div class="text-green-200 flex items-center">
        <span class="mr-2">✅</span>
        Profile updated successfully!
      </div>
    </div>
  {:else if saveStatus === 'error'}
    <div class="bg-red-600/20 border border-red-600 rounded-lg p-4">
      <div class="text-red-200 flex items-center">
        <span class="mr-2">❌</span>
        Failed to save profile. Please try again.
      </div>
    </div>
  {/if}

  {#if isLoading}
    <!-- Loading State -->
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p class="text-white ml-4">Loading profile...</p>
    </div>
  {:else}
    <!-- Tab Navigation -->
    <div class="bg-white/10 backdrop-blur-sm rounded-xl">
      <div class="flex flex-wrap border-b border-gray-600">
        <button 
          onclick={() => activeTab = 'personal'}
          class="px-6 py-4 font-medium transition-colors {activeTab === 'personal' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-gray-300 hover:text-white'}"
        >
          👤 Personal Info
        </button>
        <button 
          onclick={() => activeTab = 'ministry'}
          class="px-6 py-4 font-medium transition-colors {activeTab === 'ministry' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-gray-300 hover:text-white'}"
        >
          ⛪ Ministry Details
        </button>
        <button 
          onclick={() => activeTab = 'social'}
          class="px-6 py-4 font-medium transition-colors {activeTab === 'social' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-gray-300 hover:text-white'}"
        >
          🔗 Social Links
        </button>
        <button 
          onclick={() => activeTab = 'preferences'}
          class="px-6 py-4 font-medium transition-colors {activeTab === 'preferences' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-gray-300 hover:text-white'}"
        >
          ⚙️ Preferences
        </button>
      </div>

      <div class="p-6">
        {#if activeTab === 'personal'}
          <!-- Personal Information -->
          <div class="space-y-6">
            <div class="rounded-lg border border-white/10 bg-white/5 p-4">
              <div class="text-white font-medium mb-2">Creator Type</div>
              <div class="flex flex-wrap gap-4 text-gray-200">
                <label class="flex items-center gap-2">
                  <input type="radio" name="creatorType" value="individual" bind:group={profileData.creatorType} />
                  Individual
                </label>
                <label class="flex items-center gap-2">
                  <input type="radio" name="creatorType" value="organization" bind:group={profileData.creatorType} />
                  Organization
                </label>
              </div>
            </div>
            <!-- Profile Image -->
            <div class="flex items-start space-x-6">
              <div class="shrink-0">
                <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-600">
                  {#if profileData.personalInfo.profileImage}
                    <img 
                      src={profileData.personalInfo.profileImage} 
                      alt="Profile" 
                      class="w-full h-full object-cover"
                    />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                      👤
                    </div>
                  {/if}
                </div>
              </div>
              <div>
                <div class="text-white font-medium mb-2">Profile Image</div>
                <input 
                  type="file" 
                  accept="image/*"
                  onchange={(e) => handleFileUpload(e, 'profile')}
                  class="hidden"
                  id="profile-image"
                />
                <label 
                  for="profile-image"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors inline-block"
                >
                  Upload New Image
                </label>
                <div class="text-gray-400 text-sm mt-1">JPG, PNG or GIF. Max 5MB.</div>
              </div>
            </div>

            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-white mb-2">First Name *</label>
                <input 
                  type="text" 
                  id="firstName"
                  bind:value={profileData.personalInfo.firstName}
                  placeholder="Enter your first name"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-white mb-2">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName"
                  bind:value={profileData.personalInfo.lastName}
                  placeholder="Enter your last name"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-white mb-2">Email Address *</label>
                <input 
                  type="email" 
                  id="email"
                  bind:value={profileData.personalInfo.email}
                  placeholder="Enter your email address"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-white mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone"
                  bind:value={profileData.personalInfo.phone}
                  placeholder="Enter your phone number"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Bio -->
            <div>
              <label for="bio" class="block text-sm font-medium text-white mb-2">Bio</label>
              <textarea 
                id="bio"
                bind:value={profileData.personalInfo.bio}
                placeholder="Tell us about yourself and your ministry..."
                rows="4"
                class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              ></textarea>
              <div class="text-sm text-gray-400 mt-1">{profileData.personalInfo.bio.length}/500 characters</div>
            </div>
          </div>

        {:else if activeTab === 'ministry'}
          <!-- Ministry Information -->
          <div class="space-y-6">
            <!-- Verification Status -->
            <div class="bg-{profileData.ministryInfo.isVerified ? 'green' : 'yellow'}-600/20 border border-{profileData.ministryInfo.isVerified ? 'green' : 'yellow'}-600 rounded-lg p-4">
              <div class="flex items-center">
                <span class="text-2xl mr-3">{profileData.ministryInfo.isVerified ? '✅' : '⏳'}</span>
                <div>
                  <div class="text-white font-medium">
                    Ministry {profileData.ministryInfo.isVerified ? 'Verified' : 'Verification Pending'}
                  </div>
                  <div class="text-{profileData.ministryInfo.isVerified ? 'green' : 'yellow'}-200 text-sm">
                    {profileData.ministryInfo.isVerified 
                      ? 'Your ministry has been verified by our team.'
                      : 'Submit verification documents to get verified status.'}
                  </div>
                </div>
              </div>
            </div>

            <!-- Ministry Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="ministryName" class="block text-sm font-medium text-white mb-2">Ministry Name *</label>
                <input 
                  type="text" 
                  id="ministryName"
                  bind:value={profileData.ministryInfo.ministryName}
                  placeholder="Enter your ministry name"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="ministryWebsite" class="block text-sm font-medium text-white mb-2">Ministry Website</label>
                <input 
                  type="url" 
                  id="ministryWebsite"
                  bind:value={profileData.ministryInfo.ministryWebsite}
                  placeholder="https://yourministry.com"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="denomination" class="block text-sm font-medium text-white mb-2">Denomination</label>
                <select 
                  id="denomination"
                  bind:value={profileData.ministryInfo.denomination}
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select Denomination</option>
                  <option value="Non-denominational">Non-denominational</option>
                  <option value="Baptist">Baptist</option>
                  <option value="Methodist">Methodist</option>
                  <option value="Presbyterian">Presbyterian</option>
                  <option value="Pentecostal">Pentecostal</option>
                  <option value="Lutheran">Lutheran</option>
                  <option value="Episcopal">Episcopal</option>
                  <option value="Catholic">Catholic</option>
                  <option value="Orthodox">Orthodox</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label for="yearsInMinistry" class="block text-sm font-medium text-white mb-2">Years in Ministry</label>
                <input 
                  type="number" 
                  id="yearsInMinistry"
                  bind:value={profileData.ministryInfo.yearsInMinistry}
                  placeholder="0"
                  min="0"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Ministry Description -->
            <div>
              <label for="ministryDescription" class="block text-sm font-medium text-white mb-2">Ministry Description</label>
              <textarea 
                id="ministryDescription"
                bind:value={profileData.ministryInfo.ministryDescription}
                placeholder="Describe your ministry, mission, and vision..."
                rows="4"
                class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <!-- Ministry Address -->
            <div>
              <label for="ministryAddress" class="block text-sm font-medium text-white mb-2">Ministry Address</label>
              <textarea 
                id="ministryAddress"
                bind:value={profileData.ministryInfo.ministryAddress}
                placeholder="Enter your ministry's physical address..."
                rows="2"
                class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <!-- Verification Documents -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="text-sm font-medium text-white">Verification Documents</div>
                <button 
                  onclick={addVerificationDocument}
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Document
                </button>
              </div>
              
              {#if profileData.ministryInfo.verificationDocuments.length > 0}
                <div class="space-y-2">
                  {#each profileData.ministryInfo.verificationDocuments as doc, index}
                    {@const docName = typeof doc === "string" ? doc : doc.name}
                    <div class="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div class="flex items-center">
                        <span class="text-blue-400 mr-2">📄</span>
                        <span class="text-white">{docName}</span>
                      </div>
                      <button 
                        onclick={() => removeVerificationDocument(index)}
                        class="text-red-400 hover:text-red-300 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-gray-400 text-sm">No documents uploaded yet. Add documents to verify your ministry.</div>
              {/if}
            </div>
          </div>

        {:else if activeTab === 'social'}
          <!-- Social Links -->
          <div class="space-y-6">
            <div class="text-gray-300 mb-6">
              Connect your social media accounts to help viewers find and follow your ministry across platforms.
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="youtube" class="text-sm font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">📺</span> YouTube Channel
                </label>
                <input 
                  type="url" 
                  id="youtube"
                  bind:value={profileData.socialLinks.youtube}
                  placeholder="https://youtube.com/@yourchannel"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="facebook" class="text-sm font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">📘</span> Facebook Page
                </label>
                <input 
                  type="url" 
                  id="facebook"
                  bind:value={profileData.socialLinks.facebook}
                  placeholder="https://facebook.com/yourpage"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="instagram" class="text-sm font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">📷</span> Instagram
                </label>
                <input 
                  type="url" 
                  id="instagram"
                  bind:value={profileData.socialLinks.instagram}
                  placeholder="https://instagram.com/youraccount"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="twitter" class="text-sm font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">🐦</span> Twitter/X
                </label>
                <input 
                  type="url" 
                  id="twitter"
                  bind:value={profileData.socialLinks.twitter}
                  placeholder="https://twitter.com/youraccount"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="website" class="text-sm font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">🌐</span> Personal Website
                </label>
                <input 
                  type="url" 
                  id="website"
                  bind:value={profileData.socialLinks.website}
                  placeholder="https://yourwebsite.com"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="podcast" class="text-sm font-medium text-white mb-2 flex items-center">
                  <span class="mr-2">🎙️</span> Podcast
                </label>
                <input 
                  type="url" 
                  id="podcast"
                  bind:value={profileData.socialLinks.podcast}
                  placeholder="https://yourpodcast.com"
                  class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

        {:else if activeTab === 'preferences'}
          <!-- Preferences -->
          <div class="space-y-6">
            <div class="text-gray-300 mb-6">
              Configure your profile visibility and notification preferences.
            </div>

            <!-- Privacy Settings -->
            <div>
              <h3 class="text-lg font-medium text-white mb-4">Privacy Settings</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-white font-medium">Public Profile</div>
                    <div class="text-gray-400 text-sm">Make your profile visible to platform users</div>
                  </div>
                  <input 
                    type="checkbox" 
                    bind:checked={profileData.preferences.publicProfile}
                    class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-white font-medium">Show Contact Information</div>
                    <div class="text-gray-400 text-sm">Display your email and phone on your public profile</div>
                  </div>
                  <input 
                    type="checkbox" 
                    bind:checked={profileData.preferences.showContactInfo}
                    class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <!-- Notification Settings -->
            <div>
              <h3 class="text-lg font-medium text-white mb-4">Notifications</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-white font-medium">Email Notifications</div>
                    <div class="text-gray-400 text-sm">Receive general platform notifications</div>
                  </div>
                  <input 
                    type="checkbox" 
                    bind:checked={profileData.preferences.emailNotifications}
                    class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-white font-medium">Review Notifications</div>
                    <div class="text-gray-400 text-sm">Get notified about content review status changes</div>
                  </div>
                  <input 
                    type="checkbox" 
                    bind:checked={profileData.preferences.reviewNotifications}
                    class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-white font-medium">Marketing Emails</div>
                    <div class="text-gray-400 text-sm">Receive promotional content and platform updates</div>
                  </div>
                  <input 
                    type="checkbox" 
                    bind:checked={profileData.preferences.marketingEmails}
                    class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

