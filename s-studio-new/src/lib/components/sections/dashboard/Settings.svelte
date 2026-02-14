<script lang="ts">
  export let settings = {
    notificationsEnabled: true,
    language: 'English',
  };

  // Simulate toggling notification preference
  const toggleNotifications = () => {
    settings.notificationsEnabled = !settings.notificationsEnabled;
  };

  // Simulate changing language
  const changeLanguage = (e: Event) => {
    const target = e.target as HTMLSelectElement; // Explicitly type target as HTMLSelectElement
    if (target) {
      settings.language = target.value;
    }
  };
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Settings</h2>

  <div class="space-y-4">
    <div class="flex items-center justify-between p-4 bg-muted-foreground/10 rounded shadow-md">
      <span class="font-medium">Notifications</span>
      <label class="switch">
        <input type="checkbox" checked={settings.notificationsEnabled} on:change={toggleNotifications} />
        <span class="slider round"></span>
      </label>
    </div>

    <div class="flex items-center justify-between p-4 bg-muted-foreground/10 rounded shadow-md">
      <span class="font-medium">Language</span>
      <select class="p-2 rounded" bind:value={settings.language} on:change={changeLanguage}>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
      </select>
    </div>
  </div>
</section>
