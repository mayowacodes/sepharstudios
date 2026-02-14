import { onClickOutside } from '$lib/utils/onClickOutside';
import { createPopperActions } from 'svelte-popperjs';
import type { Placement } from '@popperjs/core';

interface DropdownOptions {
  onClose?: () => void;
  placement?: Placement;
}

export function useDropdown({ onClose, placement = 'bottom-start' }: DropdownOptions = {}) {
  const [popperRef, popperContent] = createPopperActions({ placement });

  let triggerEl: HTMLElement | null = null;

  function combinedPopperRef(node: HTMLElement) {
    triggerEl = node;
    popperRef(node);

    if (onClose) {
      onClickOutside(onClose, node);
    }

    return {
      destroy() {
        popperRef?.(node)?.destroy?.();
      }
    };
  }

  return {
    trigger: combinedPopperRef,
    content: popperContent,
    get triggerEl() {
      return triggerEl;
    }
  };
}
