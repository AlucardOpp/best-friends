import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
import {initCustomSelect} from './modules/form/init-custom-select';
import {initFormValidate} from './modules/form/init-form-validate';
import {mainNavToggle} from './modules/init-main-nav';
import {inputCode} from './modules/input-code';
import {inclineGoods} from './modules/incline-goods';
import {initHeader} from './modules/init-header';
import {favoriteBtnAction} from './modules/favorite-btn-action';
import {initSliders} from './modules/sliders/init-sliders';
import {enableVideos} from './modules/enable-videos';
import {setHeaderHeight} from './modules/set-header-height';
import {initRangeSliders} from './modules/init-range-sliders';
import {initFilters} from './modules/init-filters';
import {initFiltersTooltips} from './modules/init-filters-tooltips';
import {initAccordions} from './modules/init-accordion';
import {initProductPriceBtns} from './modules/init-product-price-btns';
import {initkaleido} from './modules/init-kaleido';
import {initImgZoom} from './modules/init-img-zoom';
import {initSequence} from './modules/init-sequence';
import {initRingSizeSlider} from './modules/init-ring-size-slider';
import {initTabs} from './modules/init-tabs';
import {initFiltration} from './modules/filtration-modules';
import {initHoverVideo} from './modules/init-hover-video';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();
    initCustomSelect();
    initFormValidate();
    mainNavToggle();
    inputCode();
    inclineGoods();
    initHeader();
    favoriteBtnAction();
    initSliders();
    enableVideos();
    setHeaderHeight();
    initRangeSliders();
    initFilters();
    initFiltersTooltips();
    initAccordions();
    initProductPriceBtns();
    initkaleido();
    initImgZoom();
    initSequence();
    initRingSizeSlider();
    initTabs();
    initFiltration();
    initHoverVideo();
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используейтся matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
