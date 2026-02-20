import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const load = () => {
  // Temporarily disable redirect to fix loop issue
  // TODO: Implement proper navigation flow
  return {};
};