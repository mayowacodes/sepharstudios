<!-- src/routes/kids/profile/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
  
    let selectedAgeGroupDisplay = '';
    let selectedAgeGroup = '';
    let uploadedImage = '';
    let imageInput: HTMLInputElement;
    
    const avatars = [
      { name: 'Lambie', emoji: '🐑' },
      { name: 'Dove', emoji: '🕊️' },
      { name: 'Lionheart', emoji: '🦁' },
      { name: 'Angel', emoji: '👼' },
    ];
  
    // For kiddies - emoji avatar selection
    function selectAvatar(index: number) {
      localStorage.setItem('avatar', String(index));
      localStorage.setItem('avatarType', 'emoji');
      navigateToDestination();
    }
    
    // For teens - image upload
    function handleImageUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          localStorage.setItem('avatar', imageData);
          localStorage.setItem('avatarType', 'image');
          uploadedImage = imageData;
        };
        reader.readAsDataURL(file);
      }
    }
    
    function useUploadedImage() {
      if (uploadedImage) {
        navigateToDestination();
      }
    }
    
    function navigateToDestination() {
      const selectedAgeGroup = localStorage.getItem('selectedAgeGroup');
      
      if (selectedAgeGroup) {
        // Set this as their current age group and navigate to their selection
        localStorage.setItem('ageGroup', selectedAgeGroup);
        goto(`/kids/${selectedAgeGroup}`);
        // Clear the temporary selection
        localStorage.removeItem('selectedAgeGroup');
      } else {
        // Fallback to existing age group or default to kiddies
        const ageGroup = localStorage.getItem('ageGroup') || 'kiddies';
        goto(`/kids/${ageGroup}`);
      }
    }
  
    onMount(() => {
      // Set display text based on selected age group
      const tempSelectedAgeGroup = localStorage.getItem('selectedAgeGroup');
      if (tempSelectedAgeGroup) {
        selectedAgeGroup = tempSelectedAgeGroup;
        selectedAgeGroupDisplay = tempSelectedAgeGroup === 'kiddies' ? 'Kiddies' : 'Teens';
      } else {
        // If no selection, redirect back to age selection
        goto('/kids');
      }
    });
  </script>
  
  <main class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-yellow-200 text-center p-6">
    <!-- Back button -->
    <div class="absolute top-4 left-4">
      <button 
        on:click={() => goto('/kids')}
        class="flex items-center px-4 py-2 bg-white/80 hover:bg-white rounded-lg transition-colors text-pink-700 font-semibold"
      >
        ← Back to Age Selection
      </button>
    </div>
    
    <h1 class="text-4xl font-extrabold text-pink-700 mb-4">Choose Your Profile</h1>
    <p class="mb-4 text-lg text-pink-800">This will be your profile for Faith Kids {selectedAgeGroupDisplay}.</p>
    <p class="mb-8 text-sm text-pink-600">
      {selectedAgeGroup === 'kiddies' ? 'Select an avatar' : 'Upload your photo or select an avatar'} to continue to {selectedAgeGroupDisplay} content.
    </p>
    
    {#if selectedAgeGroup === 'teens'}
      <!-- Teens: Image upload option -->
      <div class="mb-8">
        <div class="bg-white rounded-lg p-6 shadow-md max-w-md mx-auto mb-4">
          <h3 class="text-lg font-semibold text-pink-700 mb-4">Upload Your Photo</h3>
          
          <input 
            type="file" 
            accept="image/*" 
            on:change={handleImageUpload}
            bind:this={imageInput}
            class="hidden"
          />
          
          <button 
            on:click={() => imageInput.click()}
            class="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
          >
            📷 Choose Photo
          </button>
          
          {#if uploadedImage}
            <div class="text-center">
              <img src={uploadedImage} alt="Uploaded" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-400" />
              <button 
                on:click={useUploadedImage}
                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ✓ Use This Photo
              </button>
            </div>
          {/if}
        </div>
        
        <p class="text-sm text-gray-600 mb-4">Or choose an avatar instead:</p>
      </div>
    {/if}
    
    <!-- Emoji Avatars (for both kiddies and teens as fallback) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      {#each avatars as avatar, i}
        <button
          on:click={() => selectAvatar(i)}
          class="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl hover:bg-yellow-100 transition-all"
        >
          <span class="text-6xl mb-2">{avatar.emoji}</span>
          <span class="text-md font-semibold text-pink-700">{avatar.name}</span>
        </button>
      {/each}
    </div>
  </main>
  