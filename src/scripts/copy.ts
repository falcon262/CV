// Copy buttons (email on the home page, code on case studies).
// The label becomes "Copied" with a check for 1.6s and a polite live region announces it.
// Without the Clipboard API, the text is selected instead so it can be copied by hand.
const resetAfter = 1600;

function selectText(selector: string | undefined): void {
  const target = selector ? document.querySelector(selector) : null;
  const selection = window.getSelection();
  if (!target || !selection) return;
  const range = document.createRange();
  range.selectNodeContents(target);
  selection.removeAllRanges();
  selection.addRange(range);
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy], [data-copy-from]')) {
  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  const original = label?.textContent ?? '';
  let timer: number | undefined;

  button.addEventListener('click', async () => {
    const source = button.dataset.copyFrom ? document.querySelector(button.dataset.copyFrom) : null;
    const text = button.dataset.copy ?? source?.textContent ?? '';
    const status = button.dataset.copyStatus ? document.querySelector(button.dataset.copyStatus) : null;

    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(text);
    } catch {
      selectText(button.dataset.copySelect ?? button.dataset.copyFrom);
      return;
    }

    window.clearTimeout(timer);
    button.classList.add('is-copied');
    if (label) label.textContent = 'Copied';
    if (status) status.textContent = button.dataset.copyAnnounce ?? 'Copied';

    timer = window.setTimeout(() => {
      button.classList.remove('is-copied');
      if (label) label.textContent = original;
      if (status) status.textContent = '';
    }, resetAfter);
  });
}

export {};
