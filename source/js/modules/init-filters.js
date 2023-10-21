const initFilters = () => {
  const filterBlock = document.querySelector('.filters');
  const jewelryFilters = document.querySelector('.jewelry-filters');

  if (!filterBlock && !jewelryFilters) {
    return;
  }

  if (filterBlock) {
    const toggleBtn = filterBlock.querySelector('.filters__btn');
    toggleBtn.addEventListener('click', () => {
      filterBlock.classList.toggle('active');
    });
  } else if (jewelryFilters) {
    const toggleBtn = jewelryFilters.querySelector('.jewelry-filters__button');
    toggleBtn.addEventListener('click', () => {
      jewelryFilters.classList.toggle('is-active');
    });
  }

  document.addEventListener('click', (e) => {
    if (filterBlock) {
      if (!e.target.closest('.filters') && filterBlock.classList.contains('active')) {
        filterBlock.classList.remove('active');
      }
    } else if (jewelryFilters) {
      if (!e.target.closest('.jewelry-filters__selects') && jewelryFilters.classList.contains('is-active')) {
        jewelryFilters.classList.remove('is-active');
      }
    }
  });

  if (jewelryFilters) {
    const applyButton = jewelryFilters.querySelector('.jewelry-filters__apply');
    applyButton.addEventListener('click', () => {
      jewelryFilters.classList.remove('is-active');
    });
    document.addEventListener('click', (evt) => {
      if (jewelryFilters) {
        if (evt.target.closest('.jewelry-filters__filter-btn')) {
          const jewelryBlock = evt.target.parentElement;
          const jewelryFiltersButtons = jewelryBlock.querySelectorAll('.jewelry-filters__filter-btn');
          jewelryFiltersButtons.forEach((button) => {
            button.classList.remove('is-active');
          });
          evt.target.classList.add('is-active');
        }
      }
    });
  }
};

export {initFilters};
