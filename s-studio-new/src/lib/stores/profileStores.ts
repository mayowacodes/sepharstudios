import { writable } from 'svelte/store';
import type { Profile } from '$lib/types';

export const currentProfile = writable<Profile | null>(null);

export async function fetchCurrentProfile() {
  try {
    const response = await fetch('/api/profile/current');
    if (response.ok) {
      const profile = await response.json();
      currentProfile.set(profile);
      return profile;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch current profile:', error);
    return null;
  }
}

export async function updateProfile(data: Partial<Profile>) {
  try {
    const response = await fetch('/api/profile/current', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const updatedProfile = await response.json();
      currentProfile.set(updatedProfile);
      return updatedProfile;
    }
    throw new Error('Failed to update profile');
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
}