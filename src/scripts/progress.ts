// Reading progress fallback: only runs where scroll-driven animations are not
// supported, or under reduced motion (where the CSS animation is switched off
// and the bar simply follows the scroll position without animating).
const bar = document.querySelector<HTMLElement>('[data-progress]');
const scrollTimelines = CSS.supports('animation-timeline: scroll()');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (bar && (!scrollTimelines || reducedMotion)) {
  let queued = false;
  const update = () => {
    queued = false;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 1;
    bar.style.setProperty('--progress', progress.toFixed(4));
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
}

export {};
