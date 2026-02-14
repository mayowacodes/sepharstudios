import { writable } from 'svelte/store';
import type { UserResource } from '@clerk/types';

export const user = writable<UserResource | null>(null);
