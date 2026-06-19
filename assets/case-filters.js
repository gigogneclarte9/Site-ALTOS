(() => {
  const state = { sector: 'all', type: 'all' };
  const sectorBtns = document.querySelectorAll('.filter-btn');
  const typeBtns = document.querySelectorAll('.type-btn');
  const allCards = document.querySelectorAll('.case[data-sector], .case-mini[data-sector]');
  const auditSection = document.querySelector('.audits-section');
  const legacySection = document.querySelector('.legacy-cases-section');

  function applyFilters() {
    let auditVisible = 0;
    let missionVisible = 0;

    allCards.forEach((card) => {
      const matchSector = state.sector === 'all' || card.dataset.sector === state.sector;
      const matchType = state.type === 'all' || card.dataset.type === state.type;
      const show = matchSector && matchType;

      card.classList.toggle('is-hidden', !show);
      if (show) {
        if (card.dataset.type === 'audit') auditVisible++;
        else if (card.dataset.type === 'mission') missionVisible++;
      }
    });

    if (auditSection) auditSection.classList.toggle('is-hidden', auditVisible === 0);
    if (legacySection) legacySection.classList.toggle('is-hidden', missionVisible === 0);
  }

  sectorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sectorBtns.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      state.sector = btn.dataset.filter;
      applyFilters();
    });
  });

  typeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      typeBtns.forEach((item) => item.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.type = btn.dataset.type;
      applyFilters();
    });
  });
})();
