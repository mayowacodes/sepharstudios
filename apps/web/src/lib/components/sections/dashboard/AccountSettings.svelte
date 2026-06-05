<script lang="ts">
  import { Button } from '$lib/components/ui/button'; // Import the Button component

  let { accountSettings = {
    email: 'user@example.com',
    password: '••••••••',
  } }: { accountSettings?: { email: string; password: string } } = $props();

  // Sync the editable fields whenever the parent passes a different
  // accountSettings prop (e.g. after a save round-trip). The previous
  // `$state(accountSettings.email)` captured only the initial mount
  // value and ignored subsequent prop updates.
  let newEmail = $state('');
  let newPassword = $state('');
  $effect(() => {
    newEmail = accountSettings.email;
    newPassword = accountSettings.password;
  });

  // Simulate updating account details
  const updateAccountDetails = () => {
    accountSettings.email = newEmail;
    accountSettings.password = newPassword;
    alert('Account details updated');
  };
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Account Settings</h2>

  <div class="space-y-4">
    <div class="flex flex-col p-4 bg-muted-foreground/10 rounded shadow-md">
      <label for="email" class="font-medium">Email</label>
      <input
        id="email"
        type="email"
        class="p-2 rounded mt-2"
        bind:value={newEmail}
        placeholder="Enter your email"
      />
    </div>

    <div class="flex flex-col p-4 bg-muted-foreground/10 rounded shadow-md">
      <label for="password" class="font-medium">Password</label>
      <input
        id="password"
        type="password"
        class="p-2 rounded mt-2"
        bind:value={newPassword}
        placeholder="Enter your password"
      />
    </div>

    <Button variant="default" onclick={updateAccountDetails} class="mt-4">Save Changes</Button>
  </div>
</section>
