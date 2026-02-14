import { writable } from 'svelte/store';

export type AgeGroup = 'kiddies' | 'teens' | null;

export const ageGroup = writable<AgeGroup>(null);

export const isAgeGatePassed = writable(false);