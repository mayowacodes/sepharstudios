import type { MediaItem } from '$lib/types/media';
import { mediaModalStore } from '$lib/stores/mediaModalStore';

export function openMediaById(id: string, dataset: MediaItem[]) {
  const media = dataset.find(item => item.id === id);
  if (media) {
    mediaModalStore.open(media);
  }
}
