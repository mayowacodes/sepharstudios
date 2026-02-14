<script lang="ts">
  let { user } = $props<{ user: any }>();
</script>

<section class="flex items-center justify-between flex-wrap gap-4">
  <div>
    <h1 class="text-2xl md:text-4xl font-bold">Welcome to <span class="text-primary">My Studios</span></h1>
    <p class="text-muted-foreground">Hello, {user.name} 👋</p>
  </div>
  <img src={user.image || '/default-avatar.png'} alt="Avatar" class="w-16 h-16 rounded-full object-cover border" />
</section>
