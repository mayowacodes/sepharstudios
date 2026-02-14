<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Plus, User } from 'lucide-svelte';
	import { cn } from '$lib/utils';
  import { Label } from '$lib/components/ui/label';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogTrigger,
		DialogHeader,
		DialogTitle,
    DialogFooter
	} from '$lib/components/ui/dialog';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
  import { Input } from '$lib/components/ui/input';

	let profiles = $state([
		{ id: 1, name: 'John', type: 'adult', avatar: 'bg-red-500' },
		{ id: 2, name: 'Sarah', type: 'adult', avatar: 'bg-blue-500' },
		{ id: 3, name: 'Teen', type: 'teen', avatar: 'bg-green-500' },
		{ id: 4, name: 'Kids', type: 'kids', avatar: 'bg-yellow-500' }
	]);
	const PROFILE_TYPES = [
		{ id: 'adult', label: 'Adult', description: 'Full access to all content' },
		{ id: 'teen', label: 'Teen', description: 'Age-appropriate content for teenagers' },
		{ id: 'kids', label: 'Kids', description: 'Child-friendly content only' }
	];

	const AVATAR_COLORS = [
		'bg-red-500',
		'bg-blue-500',
		'bg-green-500',
		'bg-yellow-500',
		'bg-purple-500',
		'bg-pink-500'
	];
</script>

<div class="min-h-screen bg-gradient-to-b from-background to-accent/10">
	<div class="container py-16">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-bold">Who's Watching?</h1>
				<p class="text-muted-foreground">Choose a profile to start watching</p>
			</div>
			<Button variant="outline">Manage Profiles</Button>
		</div>

		<div class="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
			{#each profiles as profile, i}
				<Card class="group cursor-pointer transition-transform hover:scale-105">
					<CardContent class="p-4 text-center">
						<div
							class={cn(
								'mx-auto h-32 w-32 rounded-lg',
								profile.avatar,
								'mb-4 flex items-center justify-center ring-primary group-hover:ring-4'
							)}
						>
							<User class="h-16 w-16 text-white" />
						</div>
						<h3 class="text-lg font-medium">{profile.name}</h3>
						<p class="text-sm capitalize text-muted-foreground">{profile.type}</p>
					</CardContent>
				</Card>
			{/each}

			<Dialog>
				<DialogTrigger asChild let:builder>
					<div use:builder.action {...builder} class="cursor-pointer border-dashed transition-transform hover:scale-105 rounded-lg border-2 border-border bg-card text-card-foreground shadow-sm">
						<div class="flex h-full flex-col items-center justify-center p-4 text-center">
							<div class="mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">
								<Plus class="h-16 w-16 text-muted-foreground" />
							</div>
							<h3 class="text-lg font-medium">Add Profile</h3>
						</div>
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Profile</DialogTitle>
						<DialogDescription>
							Add a new profile for another person watching Sephar Studios
						</DialogDescription>
					</DialogHeader>
					<form class="space-y-6">
						<div class="space-y-2">
							<Label for="name">Profile Name</Label>
							<Input id="name" placeholder="Enter name" />
						</div>
						<div class="space-y-2">
							<Label>Profile Type</Label>
							<RadioGroup value="adult">
                {#each PROFILE_TYPES as type, i}
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label for={type.id} class="flex-1">
                    <span class="font-medium">{type.label}</span>
                    <span class="text-sm text-muted-foreground block">{type.description}</span>
                  </Label>
                </div>
                {/each}
							</RadioGroup>
						</div>
						<div class="space-y-2">
							<Label>Avatar Color</Label>
							<div class="flex flex-wrap gap-2">
                {#each AVATAR_COLORS as color, i}
                <Button
                  type="button"
                  class={`w-10 h-10 rounded-full ${color} hover:ring-4 ring-offset-2 ring-offset-background ring-primary transition-all`}
                />
                {/each}
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Create Profile</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	</div>
</div>
