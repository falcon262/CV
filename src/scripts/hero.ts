// Hero: activating the record block replays the parse sequence.
// The first play is started by the inline script in Hero.astro, before first paint.
const hero = document.querySelector<HTMLElement>('.hero');
const replay = document.querySelector<HTMLButtonElement>('[data-record-replay]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (hero && replay) {
  replay.addEventListener('click', () => {
    if (reducedMotion.matches) return;
    hero.classList.remove('is-parsing');
    // Force a style recalculation so the animations restart from the beginning.
    void hero.offsetWidth;
    hero.classList.add('is-parsing');
  });
}

export {};
