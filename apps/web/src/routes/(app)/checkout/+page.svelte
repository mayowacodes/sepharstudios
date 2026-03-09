<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Check, Shield, CreditCard, Gift } from '@lucide/svelte';

  type Plan = 'basic' | 'premium' | 'creator';

  interface PlanConfig {
    id: Plan;
    name: string;
    price: number;
    features: string[];
    isPopular?: boolean;
  }

  const plans: PlanConfig[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 3,
      features: [
        'HD streaming',
        '1 screen at a time',
        'Access to standard library',
        'Download on 1 device'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 10,
      features: [
        '4K Ultra HD streaming',
        '2 screens at a time',
        'Full content library',
        'Downloads on 2 devices',
        'Offline viewing'
      ],
      isPopular: true
    },
    {
      id: 'creator',
      name: 'Creator',
      price: 15,
      features: [
        'Everything in Premium',
        'Upload & publish content',
        'Revenue share dashboard',
        'Creator analytics',
        'Priority support'
      ]
    }
  ];

  let selectedPlan = $state<Plan>('premium');
  let step = $state<'select' | 'verify' | 'processing'>('select');
  let phoneNumber = $state('');
  let otp = $state('');
  let otpSent = $state(false);
  let error = $state('');
  let sending = $state(false);
  let verifying = $state(false);

  const selected = $derived(plans.find(p => p.id === selectedPlan)!);

  async function sendOtp() {
    if (!phoneNumber.trim()) {
      error = 'Please enter your phone number';
      return;
    }
    sending = true;
    error = '';
    try {
      const res = await fetch('/api/subscriptions/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      if (res.ok) {
        otpSent = true;
      } else {
        const data = await res.json();
        error = data.error || 'Failed to send OTP';
      }
    } catch {
      error = 'Network error. Please try again.';
    } finally {
      sending = false;
    }
  }

  async function startTrial() {
    if (!otp.trim()) {
      error = 'Please enter the verification code';
      return;
    }
    verifying = true;
    error = '';
    try {
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, phone: phoneNumber, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        error = data.error || 'Failed to start checkout';
        return;
      }
      step = 'processing';
      // Redirect to Paystack
      window.location.href = data.authorizationUrl;
    } catch {
      error = 'Network error. Please try again.';
    } finally {
      verifying = false;
    }
  }
</script>

<svelte:head>
  <title>Start Your Free Trial - Sephar Studios</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-b from-background to-accent/10 py-12 px-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-full px-4 py-1.5 text-sm mb-4">
        <Gift class="w-4 h-4" />
        3 months free — no charge today
      </div>
      <h1 class="text-3xl font-bold mb-2">Choose Your Plan</h1>
      <p class="text-muted-foreground">Cancel anytime before your trial ends. Your card is required to start.</p>
    </div>

    {#if step === 'select'}
      <!-- Plan selection -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {#each plans as plan}
          <button
            onclick={() => selectedPlan = plan.id}
            class="text-left rounded-xl border-2 transition-all p-5 {selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-muted-foreground/40'}"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-semibold text-lg">{plan.name}</p>
                <p class="text-2xl font-bold">${plan.price}<span class="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              {#if plan.isPopular}
                <Badge class="bg-primary text-white">Popular</Badge>
              {/if}
              {#if selectedPlan === plan.id}
                <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check class="w-3 h-3 text-white" />
                </div>
              {/if}
            </div>
            <ul class="space-y-1.5">
              {#each plan.features as feature}
                <li class="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check class="w-3.5 h-3.5 text-green-500 shrink-0" />
                  {feature}
                </li>
              {/each}
            </ul>
          </button>
        {/each}
      </div>

      <div class="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle class="text-base flex items-center gap-2">
              <Shield class="w-4 h-4 text-green-500" />
              Verify your phone number
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-sm text-muted-foreground">One phone number per trial. This helps us prevent abuse.</p>
            <div class="flex gap-2">
              <input
                type="tel"
                bind:value={phoneNumber}
                placeholder="+234 800 000 0000"
                class="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onclick={sendOtp} disabled={sending || otpSent} size="sm">
                {sending ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
              </Button>
            </div>

            {#if otpSent}
              <div>
                <input
                  type="text"
                  bind:value={otp}
                  placeholder="Enter 6-digit code"
                  maxlength="6"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            {/if}

            {#if error}
              <p class="text-sm text-red-400">{error}</p>
            {/if}

            <Button
              onclick={startTrial}
              disabled={!otpSent || verifying}
              class="w-full bg-primary text-white"
            >
              <CreditCard class="w-4 h-4 mr-2" />
              {verifying ? 'Redirecting...' : `Start Free Trial - ${selected.name} Plan`}
            </Button>

            <p class="text-xs text-center text-muted-foreground">
              You will be charged ${selected.price}/month after 3 months.
              Your card is verified now but not charged. Cancel anytime.
            </p>
          </CardContent>
        </Card>
      </div>

    {:else if step === 'processing'}
      <div class="text-center py-20">
        <div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
        <p class="text-muted-foreground">Redirecting to secure payment...</p>
      </div>
    {/if}
  </div>
</div>
