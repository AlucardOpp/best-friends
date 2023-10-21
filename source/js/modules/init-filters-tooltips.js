const initFiltersTooltips = () => {
  const filterBlock = document.querySelector('.filters');

  if (!filterBlock) {
    return;
  }

  const filters = filterBlock.querySelectorAll('.filters__filter');

  filters.forEach((filter) => {
    const tooltipBtn = filter.querySelector('[data-tooltip-btn]');
    const tooltipCloseBtn = filter.querySelector('[data-tooltip-close]');

    if (!tooltipBtn) {
      return;
    }

    tooltipBtn.addEventListener('click', () => {
      filter.classList.toggle('open');
    });

    tooltipCloseBtn.addEventListener('click', () => {
      filter.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    filters.forEach((filter) => {
      const tooltipBtn = filter.querySelector('[data-tooltip-btn]');
      const isNotCard = !e.target.closest('.filters__tooltip-card');
      const isNotSameBtn = (e.target.closest('[data-tooltip-btn]') ? e.target.closest('[data-tooltip-btn]') !== tooltipBtn : true);

      if (isNotCard && isNotSameBtn) {
        filter.classList.remove('open');
      }
    });
  });
};

export {initFiltersTooltips};
