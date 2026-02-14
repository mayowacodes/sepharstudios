/**
 * Utility: Calls a callback when a click occurs outside the node.
 */
export function onClickOutside(callback: () => void, node: HTMLElement) {
  function handleClick(event: MouseEvent) {
    if (!node.contains(event.target as Node)) {
      callback();
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
}
