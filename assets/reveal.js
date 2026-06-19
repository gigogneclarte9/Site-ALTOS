(() => {
  const script = document.currentScript;
  const selector = script?.dataset.revealSelector || '.reveal, .reveal-line';
  const stagger = Number(script?.dataset.revealStagger || 50);
  const threshold = Number(script?.dataset.revealThreshold || 0.1);
  const targets = document.querySelectorAll(selector);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('in'), index * stagger);
        observer.unobserve(entry.target);
      });
    }, { threshold });

    targets.forEach((element) => observer.observe(element));
  } else {
    targets.forEach((element) => element.classList.add('in'));
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'set-anim') {
      document.documentElement.style.setProperty('--anim', event.data.value);
    }
  });
})();
