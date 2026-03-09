<script lang="ts">
  import { cn } from '$lib/utils';
  import { page } from '$app/state';
  import { fly, fade } from 'svelte/transition';
 
  

  interface UserType {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }

  $: user = (page.data.user as UserType) || null;
  $: isAuthenticated = !!user;

  let className: string | undefined = undefined;
  export { className as class };
</script>

<a
  href={isAuthenticated ? '/dashboard' : '/'}
  class={cn(
    'flex items-center space-x-2 transition-opacity hover:opacity-80',
    className
  )}
>
  <img src="/logo-alone-sepharstudios.png" alt="Sephar Studios" class="h-8 w-auto object-contain" />

  {#key user?.id}
    <span
      in:fly={{ y: 8, duration: 200 }}
      out:fade={{ duration: 150 }}
      class="font-extrabold tracking-tight text-base sm:text-lg md:text-xl text-white"
    >
      {isAuthenticated ? 'My Studios' : 'Sephar Studios'}
    </span>
  {/key}
</a>
