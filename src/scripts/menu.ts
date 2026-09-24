// Mobile menu: a modal <dialog> sheet. It traps focus, closes on Escape and
// returns focus to the menu button.
const sheet = document.querySelector<HTMLDialogElement>('[data-menu]');
const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');

if (sheet && openButton) {
  let restoreFocus = true;

  const focusables = () =>
    Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

  openButton.addEventListener('click', () => {
    restoreFocus = true;
    sheet.showModal();
    openButton.setAttribute('aria-expanded', 'true');
  });

  sheet.addEventListener('close', () => {
    openButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) openButton.focus();
  });

  sheet.querySelector('[data-menu-close]')?.addEventListener('click', () => sheet.close());

  // Following a link closes the sheet and lets the browser move to the section.
  for (const link of sheet.querySelectorAll('a[href]')) {
    link.addEventListener('click', () => {
      restoreFocus = false;
      sheet.close();
    });
  }

  // Keep Tab and Shift+Tab inside the sheet.
  sheet.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // The sheet only exists below 768px; close it if the viewport grows.
  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches && sheet.open) sheet.close();
  });
}

export {};
