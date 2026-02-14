// lib/stores/mediaModalStore.ts
import { writable } from 'svelte/store';
import type { MediaItem } from '../types/media';

type ModalState = {
  isOpen: boolean;
  media: MediaItem | null;
};


const { subscribe, update, set } = writable<ModalState>({
  isOpen: false,
  media: null
});

export const mediaModalStore = {
  subscribe,
  open: (media: MediaItem) =>
    update(() => ({
      isOpen: true,
      media
    })),
  close: () =>
    set({
      isOpen: false,
      media: null
    })
};


