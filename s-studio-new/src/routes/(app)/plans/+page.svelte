<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Check } from 'lucide-svelte';

  interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    isPopular?: boolean;
  }

  let plans = $state<Plan[]>([
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: [
        'Access to all basic content',
        'Watch on one device at a time',
        'HD available',
        'Cancel anytime'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 14.99,
      features: [
        'Access to all standard content',
        'Watch on two devices at a time',
        'Full HD available',
        'Download available',
        'Cancel anytime'
      ],
      isPopular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      features: [
        'Access to all premium content',
        'Watch on four devices at a time',
        'Ultra HD available',
        'Download available',
        'Offline viewing',
        'Cancel anytime'
      ]
    }
  ]);

  let selectedPlan = $state<string>('standard');
  let isLoading = $state(false);

  async function handleSubscribe(planId: string) {
    isLoading = true;
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId })
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container max-w-5xl py-8">
  <div class="text-center space-y-4 mb-8">
    <h1 class="text-3xl font-bold">Choose Your Plan</h1>
    <p class="text-muted-foreground">
      Flexible plans for every viewer. Cancel anytime.
    </p>
  </div>

  <div class="grid gap-6 md:grid-cols-3">
    {#each plans as plan (plan.id)}
      <Card class="relative">
        {#if plan.isPopular}
          <div class="absolute -top-2 left-1/2 -translate-x-1/2">
            <span class="bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground rounded-full">
              Most Popular
            </span>
          </div>
        {/if}

        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex items-baseline">
            <span class="text-3xl font-bold">${plan.price}</span>
            <span class="text-muted-foreground ml-1">/month</span>
          </div>

          <ul class="space-y-2">
            {#each plan.features as feature}
              <li class="flex items-center">
                <Check class="h-4 w-4 text-primary mr-2" />
                <span class="text-sm">{feature}</span>
              </li>
            {/each}
          </ul>

          <Button
            class="w-full"
            variant={plan.isPopular ? 'default' : 'outline'}
            disabled={isLoading}
            onclick={() => handleSubscribe(plan.id)}
          >
            {isLoading && selectedPlan === plan.id ? 'Processing...' : 'Subscribe'}
          </Button>
        </CardContent>
      </Card>
    {/each}
  </div>
</div>