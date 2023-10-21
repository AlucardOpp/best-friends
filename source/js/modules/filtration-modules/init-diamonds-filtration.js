export default class DiamondsFiltration {
  constructor() {
    this.wrapper = document.querySelector('.catalog-goods .goods__list');

    if (!this.wrapper) {
      return;
    }

    this.goods = Array.from(this.wrapper.querySelectorAll('.goods__item[data-type="product"]'));
    this.images = this.wrapper.querySelectorAll('.goods__item[data-type="image"]');
    this.isActive = false;

    this.applyBtn = document.querySelector('.filters__filter-btn[type="submit"]');
    this.resetBtn = document.querySelector('[data-reset-sliders]');

    this.colorRange = document.querySelector('[data-range-slider="color"]');
    this.purityRange = document.querySelector('[data-range-slider="purity"]');
    this.sizeRange = document.querySelector('[data-range-slider="size"]');

    this.colorsValue = this.setColorRangeValue();
    this.purityValue = this.setPurityValue();
    this.slidersValues = {
      'purity': true,
      'color': true,
      'size': true,
    };

    this.breakpoint = '(min-width: 1024px)';

    this.paramsFromUrl = new URLSearchParams(window.location.search);

    this.init();
  }

  init() {
    window.addEventListener('resize', () => this.setAllEvents());
    this.setAllEvents();
    this.setApply();
    this.setResetEvent();

    window.addEventListener('load', this.checkParams());
  }

  isEmpty() {
    return this.goods.every((good) => good.classList.contains('hidden'));
  }

  addEmptyNotification() {
    const emptyLi = this.wrapper.querySelector('.goods__item--empty');

    if (emptyLi) {
      return;
    }

    const li = document.createElement('li');
    li.classList.add('goods__item');
    li.classList.add('goods__item--empty');

    const p = document.createElement('p');
    li.appendChild(p);
    p.textContent = 'Товары не найдены';

    this.wrapper.appendChild(li);
  }

  removeEmptyNotification() {
    const emptyLi = this.wrapper.querySelector('.goods__item--empty');

    if (!emptyLi) {
      return;
    }

    emptyLi.remove();
  }

  checkRangeValues() {
    const values = Object.entries(this.slidersValues);

    if (values.every(([, value]) => value === true)) {
      this.images.forEach((element) => element.classList.remove('hidden'));

      for (const key of this.paramsFromUrl.keys()) {
        if (key !== 'price') {
          this.paramsFromUrl.delete(key);
        }
      }

      window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);
    }
  }

  checkParams() {
    if (!this.paramsFromUrl.toString()) {
      return;
    }

    this.checkColorParams();
    this.checkSizeParams();
    this.checkPurityParams();
  }

  setColorRangeValue() {
    return {
      'd': 0,
      'e': 1,
      'f': 2,
      'g': 3,
      'j': 4,
      'h': 5,
      'i': 6,
      'k': 7,
      'l': 8,
      'm': 9,
      'n': 10,
    };
  }

  setPurityValue() {
    return {
      'vvs2': 0,
      'vvs1': 1,
      'vs1': 2,
      'vs2': 3,
      'si2': 6,
      'si3': 4,
      'si1': 5,
    };
  }

  hideDecorativeElements() {
    if (this.isActive) {
      this.images.forEach((element) => element.classList.add('hidden'));
    }
  }

  getColorValue(element) {
    return element.dataset.color.toLowerCase();
  }

  getPurityValue(element) {
    return element.dataset.purity.toLowerCase();
  }

  getSizeValue(element) {
    return Number(element.dataset.size);
  }

  checkColorParams() {
    if (this.paramsFromUrl.has('color-start') && this.paramsFromUrl.has('color-end')) {
      const min = Math.ceil(Number(this.paramsFromUrl.get('color-start')));
      const max = Math.ceil(Number(this.paramsFromUrl.get('color-end')));
      this.colorRange.noUiSlider.set([min, max]);

      this.colorFiltration(min, max);
      this.isActive = true;
      this.hideDecorativeElements();
    }
  }

  checkSizeParams() {
    if (this.paramsFromUrl.has('size-start') && this.paramsFromUrl.has('size-end')) {
      const min = Math.ceil(Number(this.paramsFromUrl.get('size-start')));
      const max = Math.ceil(Number(this.paramsFromUrl.get('size-end')));
      this.sizeRange.noUiSlider.set([min, max]);

      this.sizeFiltration(min, max);
      this.isActive = true;
      this.hideDecorativeElements();
    }
  }

  checkPurityParams() {
    if (this.paramsFromUrl.has('purity-start') && this.paramsFromUrl.has('purity-end')) {
      const min = Math.ceil(Number(this.paramsFromUrl.get('purity-start')));
      const max = Math.ceil(Number(this.paramsFromUrl.get('purity-end')));
      this.purityRange.noUiSlider.set([min, max]);

      this.purityFiltration(min, max);
      this.isActive = true;
      this.hideDecorativeElements();
    }
  }

  filterByColor() {
    let [min, max] = this.colorRange.noUiSlider.get();
    min = Math.ceil(Number(min));
    max = Math.ceil(Number(max));

    this.isActive = true;
    this.hideDecorativeElements();

    const [defaultMin] = this.colorRange.noUiSlider.options.range.min;
    const [defaultMax] = this.colorRange.noUiSlider.options.range.max;

    if (defaultMin === min && defaultMax === max) {
      this.slidersValues['color'] = true;
    } else {
      this.slidersValues['color'] = false;
    }

    this.colorFiltration(min, max);
    this.paramsFromUrl.set('color-start', min);
    this.paramsFromUrl.set('color-end', max);

    window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);
  }

  colorFiltration(min, max) {
    this.goods.filter((good) => {
      if (this.colorsValue[this.getColorValue(good)] >= min && this.colorsValue[this.getColorValue(good)] <= max) {
        good.classList.remove('filtered-by-color');

        if (!good.classList.contains('filtered-by-purity') && !good.classList.contains('filtered-by-size')) {
          good.classList.remove('hidden');
          return;
        }

        return;
      } else {
        good.classList.add('hidden');
        good.classList.add('filtered-by-color');
      }
    });

    if (this.isEmpty()) {
      this.addEmptyNotification();
    } else {
      this.removeEmptyNotification();
    }
  }

  filterByPurity() {
    let [min, max] = this.purityRange.noUiSlider.get();
    min = Math.ceil(Number(min));
    max = Math.ceil(Number(max));

    this.isActive = true;
    this.hideDecorativeElements();

    const [defaultMin] = this.purityRange.noUiSlider.options.range.min;
    const [defaultMax] = this.purityRange.noUiSlider.options.range.max;

    if (defaultMin === min && defaultMax === max) {
      this.slidersValues['purity'] = true;
    } else {
      this.slidersValues['purity'] = false;
    }

    this.purityFiltration(min, max);
    this.paramsFromUrl.set('purity-start', min);
    this.paramsFromUrl.set('purity-end', max);

    window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);
  }

  purityFiltration(min, max) {
    this.goods.filter((good) => {
      if (this.purityValue[this.getPurityValue(good)] >= min && this.purityValue[this.getPurityValue(good)] <= max) {
        good.classList.remove('filtered-by-purity');

        if (!good.classList.contains('filtered-by-color') && !good.classList.contains('filtered-by-size')) {
          good.classList.remove('hidden');
          return;
        }

        return;
      } else {
        good.classList.add('hidden');
        good.classList.add('filtered-by-purity');
      }
    });

    if (this.isEmpty()) {
      this.addEmptyNotification();
    } else {
      this.removeEmptyNotification();
    }

  }

  filterBySize() {
    let [min, max] = this.sizeRange.noUiSlider.get();
    min = Math.ceil(Number(min));
    max = Math.ceil(Number(max));

    this.isActive = true;
    this.hideDecorativeElements();

    const [defaultMin] = this.sizeRange.noUiSlider.options.range.min;
    const [defaultMax] = this.sizeRange.noUiSlider.options.range.max;

    if (defaultMin === min && defaultMax === max) {
      this.slidersValues['size'] = true;
    } else {
      this.slidersValues['size'] = false;
    }

    this.sizeFiltration(min, max);
    this.paramsFromUrl.set('size-start', min);
    this.paramsFromUrl.set('size-end', max);

    window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);
  }

  sizeFiltration(min, max) {
    this.goods.filter((good) => {
      if (this.getSizeValue(good) >= min && this.getSizeValue(good) <= max) {
        good.classList.remove('filtered-by-size');

        if (!good.classList.contains('filtered-by-color') && !good.classList.contains('filtered-by-purity')) {
          good.classList.remove('hidden');
          return;
        }

        return;
      } else {
        good.classList.add('hidden');
        good.classList.add('filtered-by-size');
      }
    });

    if (this.isEmpty()) {
      this.addEmptyNotification();
    } else {
      this.removeEmptyNotification();
    }

  }

  setColorEvent() {
    if (!this.colorRange) {
      return;
    }

    if (window.matchMedia('(min-width: 1024px)').matches) {
      this.colorRange.noUiSlider.off('change');
      this.colorRange.noUiSlider.on('change', () => {
        this.filterByColor();
        this.checkRangeValues();
      });
    } else {
      this.colorRange.noUiSlider.off('change');
    }
  }

  setPurityEvent() {
    if (!this.purityRange) {
      return;
    }

    if (window.matchMedia('(min-width: 1024px)').matches) {
      this.purityRange.noUiSlider.off('change');
      this.purityRange.noUiSlider.on('change', () => {
        this.filterByPurity();
        this.checkRangeValues();
      });
    } else {
      this.purityRange.noUiSlider.off('change');
    }
  }

  setSizeEvent() {
    if (!this.sizeRange) {
      return;
    }

    if (window.matchMedia('(min-width: 1024px)').matches) {
      this.sizeRange.noUiSlider.off('change');
      this.sizeRange.noUiSlider.on('change', () => {
        this.filterBySize();
        this.checkRangeValues();
      });
    } else {
      this.sizeRange.noUiSlider.off('change');
    }
  }

  setApply() {
    if (!this.applyBtn) {
      return;
    }

    this.applyBtn.addEventListener('click', (evt) => {
      evt.preventDefault();

      setTimeout(() => {
        this.filterByColor();
        this.filterByPurity();
        this.filterBySize();
        this.checkRangeValues();
      }, 200);
    });
  }

  setResetEvent() {
    if (!this.resetBtn) {
      return;
    }

    this.resetBtn.addEventListener('click', () => {
      setTimeout(() => {
        this.filterByColor();
        this.filterByPurity();
        this.filterBySize();
        this.checkRangeValues();
      }, 200);
    });
  }

  setAllEvents() {
    this.setColorEvent();
    this.setPurityEvent();
    this.setSizeEvent();
  }
}
