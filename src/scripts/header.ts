// Header: hides when scrolling down past 120px and comes back on scroll up.
// It never hides while the menu sheet is open or while it contains focus.
const header = document.querySelector<HTMLElement>('[data-site-header]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const threshold = 120;

if (header) {
  let lastY = window.scrollY;
  let queued = false;

  const update = () => {
    queued = false;
    const y = window.scrollY;
    const pinned =
      y <= threshold ||
      reducedMotion.matches ||
      header.contains(document.activeElement) ||
      document.querySelector('dialog[open]') !== null;

    if (pinned || y < lastY) header.classList.remove('is-hidden');
    else if (y > lastY) header.classList.add('is-hidden');
    lastY = y;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true },
  );

  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

export {};
