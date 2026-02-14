import { writable } from 'svelte/store';

export type ToastType = 'default' | 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  return {
    subscribe,
    add: (toast: Omit<Toast, 'id'>) => {
      const id = crypto.randomUUID();
      const duration = toast.duration || 5000;

      update(toasts => [...toasts, { ...toast, id }]);

      if (duration > 0) {
        setTimeout(() => {
          update(toasts => toasts.filter(t => t.id !== id));
        }, duration);
      }
    },
    remove: (id: string) => {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    clear: () => {
      update(() => []);
    }
  };
}

export const toasts = createToastStore();