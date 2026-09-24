// Theme toggle: flips data-theme, stores the choice, and crossfades colours for 200ms.
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function effectiveTheme(): 'light' | 'dark' {
  const chosen = root.getAttribute('data-theme');
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return prefersDark.matches ? 'dark' : 'light';
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  button.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    if (!reducedMotion.matches) {
      root.classList.add('theme-fade');
      window.setTimeout(() => root.classList.remove('theme-fade'), 250);
    }
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this page only.
    }
  });
}

export {};
