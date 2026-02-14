import { writable } from 'svelte/store';
import type { User } from '$lib/auth';

export const user = writable<User | null>(null);
