(() => {
  const navs = document.querySelectorAll('.nav');

  for (const nav of navs) {
    const toggle = nav.querySelector('.nav__toggle');
    const panel = nav.querySelector('.nav__mobile');
    const label = nav.querySelector('.nav__toggle-label');

    if (!toggle || !panel) continue;

    const closeMenu = ({ restoreFocus = false } = {}) => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      if (label) label.textContent = 'Menu';
      panel.hidden = true;
      if (restoreFocus) toggle.focus();
    };

    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fermer le menu');
      if (label) label.textContent = 'Fermer';
      panel.hidden = false;
      panel.querySelector('a')?.focus();
    };

    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      } else {
        openMenu();
      }
    });

    panel.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu({ restoreFocus: true });
      }
    });

    document.addEventListener('click', (event) => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target)) {
        closeMenu();
      }
    });

    const desktop = window.matchMedia('(min-width: 901px)');
    desktop.addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }
})();
