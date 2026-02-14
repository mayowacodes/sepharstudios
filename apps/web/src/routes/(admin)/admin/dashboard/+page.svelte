<script lang="ts">
  import { ShieldCheck, Smartphone, Monitor, Tablet, Tv, Activity, Users, Clock } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  
  const { data } = $props();

  const getDeviceIcon = (type: string | null) => {
    switch (type) {
      case 'tv': return Tv;
      case 'tablet': return Tablet;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

  const getDeviceColor = (type: string | null) => {
    switch (type) {
      case 'tv': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'tablet': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'mobile': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  const totalSessions = $derived(data.deviceStats.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0));
</script>

<div class="p-8 max-w-7xl mx-auto space-y-10">
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2 text-orange-500 font-medium">
        <ShieldCheck class="w-4 h-4" />
        <span>Admin Security Console</span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight">Platform Pulse</h1>
      <p class="text-muted-foreground text-lg">Real-time device monitoring and session oversight.</p>
    </div>
    
    <div class="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-muted-foreground/10">
      <div class="flex flex-col items-end">
        <span class="text-sm text-muted-foreground">Active Sessions</span>
        <span class="text-2xl font-bold font-mono tracking-tighter">{totalSessions}</span>
      </div>
      <div class="h-8 w-px bg-muted-foreground/20"></div>
      <Activity class="w-8 h-8 text-green-500 animate-pulse" />
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each data.deviceStats as stat}
      {@const Icon = getDeviceIcon(stat.deviceType)}
      <Card class="relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300">
        <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon class="w-16 h-16" />
        </div>
        <CardHeader class="pb-2">
          <CardDescription class="capitalize">{stat.deviceType || 'Unknown'}</CardDescription>
          <CardTitle class="text-3xl font-bold">{stat.count}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="w-full bg-muted h-1 rounded-full overflow-hidden">
            <div 
              class="h-full bg-orange-500" 
              style="width: {(stat.count / totalSessions) * 100}%"
            ></div>
          </div>
        </CardContent>
      </Card>
    {/each}
  </div>

  <!-- Live Feed -->
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 font-semibold text-xl">
        <Clock class="w-5 h-5 text-orange-500" />
        <h2>Live Session Feed</h2>
      </div>
      <Badge variant="outline" class="font-mono">Real-time Updates On</Badge>
    </div>

    <div class="border rounded-2xl overflow-hidden bg-background divide-y">
      {#each data.recentSessions as session}
        <div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Users class="w-5 h-5" />
            </div>
            <div>
              <div class="font-medium">{session.userName}</div>
              <div class="text-xs text-muted-foreground">{session.userEmail}</div>
            </div>
          </div>

          <div class="hidden md:flex flex-col items-center gap-1">
            <Badge variant="outline" class={getDeviceColor(session.deviceType)}>
              <div class="flex items-center gap-1">
                {@const DeviceIcon = getDeviceIcon(session.deviceType)}
                <DeviceIcon class="w-3 h-3" />
                <span class="capitalize">{session.deviceType || 'Desktop'}</span>
              </div>
            </Badge>
            <span class="text-[10px] text-muted-foreground font-mono">{session.ipAddress || '0.0.0.0'}</span>
          </div>

          <div class="text-sm text-muted-foreground font-mono">
            {new Date(session.createdAt).toLocaleTimeString()}
          </div>
        </div>
      {:else}
        <div class="p-10 text-center text-muted-foreground">
          No active sessions detected.
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(.premium-glass) {
    background: rgba(var(--background), 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(var(--muted-foreground), 0.1);
  }
</style>
