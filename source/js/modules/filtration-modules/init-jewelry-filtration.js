export default class JewelryFiltration {
  constructor() {
    this.wrapper = document.querySelector('.catalog-goods .goods__list');

    if (!this.wrapper) {
      return;
    }

    this.wrapperItems = Array.from(this.wrapper.querySelectorAll('.goods__item'));
    this.goods = Array.from(this.wrapper.querySelectorAll('.goods__item[data-type="product"]'));
    this.images = this.wrapper.querySelectorAll('.goods__item[data-type="image"]');
    this.isActive = false;
    //  filters

    this.priceFilter = document.querySelector('[data-id="price"] .custom-select__list');
    this.collectionFilter = document.querySelector('[data-id="collection"] .custom-select__list');
    this.materialFilter = document.querySelector('[data-id="material"] .custom-select__list');
    this.mbMaterialFilter = document.querySelector('[data-filter="material"]');
    this.mbCollectionFilter = document.querySelector('[data-filter="collection"]');

    this.mbFilterState = {};
    this.applyBtn = document.querySelector('.jewelry-filters__apply');

    this.paramsFromUrl = new URLSearchParams(window.location.search);

    this.selectValues = {
      'material': true,
      'collection': true,
    };

    this.init();
  }

  init() {
    this.priceSelectEvent();
    this.materialSelectEvent();
    this.filterSelectEvent();
    this.setMbMaterialEvent();
    this.setMbCollectionEvent();
    this.setApplyEvent();
    this.setDecorativeElementsIndex();

    window.addEventListener('load', this.checkParams());
  }

  setDecorativeElementsIndex() {
    this.wrapperItems.forEach((item, index) => {
      if (item.dataset.type === 'image') {
        item.dataset.index = index;
      }
    });
  }

  checkSelectValues() {
    const values = Object.entries(this.selectValues);

    if (values.every(([, value]) => value === true)) {
      this.images.forEach((element) => element.classList.remove('hidden'));

      for (const key of this.paramsFromUrl.keys()) {
        if (key !== 'price') {
          this.paramsFromUrl.delete(key);
          window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);
        }
      }
    }
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

  checkParams() {
    if (!this.paramsFromUrl.toString()) {
      return;
    }

    this.checkSortParams();
    this.checkMaterialParams();
    this.checkCollectionParams();
  }

  hideDecorativeElements() {
    if (this.isActive) {
      this.images.forEach((element) => element.classList.add('hidden'));
    }
  }

  getPrice(element) {
    return Number(element.dataset.price.replace(/ /g, ''));
  }

  getOptionValue(option) {
    return option.dataset.selectValue;
  }

  getSelectValues(parent) {
    return Array.from(parent.querySelectorAll('.custom-select__item')).map((value) => value.dataset.selectValue);
  }

  changeSelectOption(parent, param) {
    const values = parent.querySelectorAll('.custom-select__item');
    const btn = parent.closest('.custom-select__wrap').querySelector('.custom-select__button .custom-select__text');

    values.forEach((value) => {
      if (value.dataset.selectValue === this.paramsFromUrl.get(param)) {
        value.ariaSelected = true;
        const text = value.innerHTML;
        btn.innerHTML = text;
      } else {
        value.ariaSelected = false;
      }
    });
  }

  setButtonActive(parent, param) {
    const buttons = parent.querySelectorAll('.jewelry-filters__filter-btn');

    buttons.forEach((button) => {
      if (button.dataset.selectValue === this.paramsFromUrl.get(param)) {
        button.classList.add('is-active');
      } else {
        button.classList.remove('is-active');
      }
    });
  }

  checkSortParams() {
    if (this.paramsFromUrl.has('price')) {
      const sorted = this.goods.sort((goodA, goodB) => {
        switch (this.paramsFromUrl.get('price')) {
          case 'price-expensive' : {
            return this.getPrice(goodB) - this.getPrice(goodA);
          }
          case 'price-cheaper' : {
            return this.getPrice(goodA) - this.getPrice(goodB);
          }
          default : {
            return 0;
          }
        }
      });

      this.changeSelectOption(this.priceFilter, 'price');


      const current = this.wrapper.querySelectorAll('.goods__item');

      this.images.forEach((image, index) => {
        image.remove();
        if (current[Number(image.dataset.index) + this.images.length - index]) {
          current[Number(image.dataset.index) + this.images.length - index].insertAdjacentElement('beforebegin', image);
        } else {
          current[current.length - 1].insertAdjacentElement('afterend', image);
        }
      });

      sorted.forEach((element) => {
        this.wrapper.append(element);
      });
    }
  }

  checkMaterialParams() {
    if (this.paramsFromUrl.has('material')) {
      this.goods.filter((good) => {
        if (this.paramsFromUrl.get('material') === 'all' || this.paramsFromUrl.get('material') === 'material') {
          good.classList.remove('filtered-by-material');

          if (!good.classList.contains('filtered-by-collection')) {
            good.classList.remove('hidden');
            return;
          } else {
            return;
          }
        }

        if (good.dataset.material !== this.paramsFromUrl.get('material')) {
          good.classList.add('hidden');
          good.classList.add('filtered-by-material');
        } else {
          if (!good.classList.contains('filtered-by-collection')) {
            good.classList.remove('hidden');
          }
          good.classList.remove('filtered-by-material');
        }
      });

      this.changeSelectOption(this.materialFilter, 'material');
      this.setButtonActive(this.mbMaterialFilter, 'material');

      this.isActive = true;
      this.hideDecorativeElements();

      if (this.isEmpty()) {
        this.addEmptyNotification();
      } else {
        this.removeEmptyNotification();
      }
    }
  }

  checkCollectionParams() {
    if (this.paramsFromUrl.has('collection')) {
      this.goods.filter((good) => {
        if (this.paramsFromUrl.get('collection') === 'all' || this.paramsFromUrl.get('collection') === 'collection') {
          good.classList.remove('filtered-by-collection');

          if (!good.classList.contains('filtered-by-material')) {
            good.classList.remove('hidden');
            return;
          } else {
            return;
          }
        }

        if (good.dataset.collection !== this.paramsFromUrl.get('collection')) {
          good.classList.add('hidden');
          good.classList.add('filtered-by-collection');
        } else {
          if (!good.classList.contains('filtered-by-material')) {
            good.classList.remove('hidden');
          }
          good.classList.remove('filtered-by-collection');
        }
      });

      this.changeSelectOption(this.collectionFilter, 'collection');
      this.setButtonActive(this.mbCollectionFilter, 'collection');

      this.isActive = true;
      this.hideDecorativeElements();

      if (this.isEmpty()) {
        this.addEmptyNotification();
      } else {
        this.removeEmptyNotification();
      }
    }
  }

  sortByPrice(target) {
    const sorted = this.goods.sort((goodA, goodB) => {
      switch (target.dataset.selectValue) {
        case 'price-expensive' : {
          return this.getPrice(goodB) - this.getPrice(goodA);
        }
        case 'price-cheaper' : {
          return this.getPrice(goodA) - this.getPrice(goodB);
        }
        default : {
          return 0;
        }
      }
    });

    this.paramsFromUrl.set('price', target.dataset.selectValue);
    window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);

    sorted.forEach((element) => {
      this.wrapper.append(element);
    });

    const current = this.wrapper.querySelectorAll('.goods__item');

    this.images.forEach((image, index) => {
      image.remove();
      if (current[Number(image.dataset.index) + this.images.length - index]) {
        current[Number(image.dataset.index) + this.images.length - index].insertAdjacentElement('beforebegin', image);
      } else {
        current[current.length - 1].insertAdjacentElement('afterend', image);
      }
    });


    if (this.isEmpty()) {
      this.addEmptyNotification();
    } else {
      this.removeEmptyNotification();
    }
  }

  priceSelectEvent() {
    const values = this.priceFilter.querySelectorAll('.custom-select__item');

    values.forEach((value) => {
      value.addEventListener('click', (evt) => this.sortByPrice(evt.target));
    });
  }

  filterByMaterial(target) {
    this.goods.filter((good) => {
      if (this.getOptionValue(target) === 'all' || this.getOptionValue(target) === 'material') {
        good.classList.remove('filtered-by-material');

        if (!good.classList.contains('filtered-by-collection')) {
          good.classList.remove('hidden');
          return;
        } else {
          return;
        }
      }

      if (good.dataset.material !== this.getOptionValue(target)) {
        good.classList.add('hidden');
        good.classList.add('filtered-by-material');
      } else {
        if (!good.classList.contains('filtered-by-collection')) {
          good.classList.remove('hidden');
        }
        good.classList.remove('filtered-by-material');
      }
    });

    this.paramsFromUrl.set('material', target.dataset.selectValue);
    window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);

    this.isActive = true;
    this.hideDecorativeElements();

    if (this.isEmpty()) {
      this.addEmptyNotification();
    } else {
      this.removeEmptyNotification();
    }
  }

  materialSelectEvent() {
    if (!this.materialFilter) {
      return;
    }

    const values = this.materialFilter.querySelectorAll('.custom-select__item');

    values.forEach((value) => {
      value.addEventListener('click', (evt) => {
        this.filterByMaterial(evt.target);
        this.selectValues['material'] = this.getOptionValue(evt.target) === 'all' || this.getOptionValue(evt.target) === 'material' ? true : false;
        this.checkSelectValues();
      });
    });
  }

  filterByCollection(target) {
    this.goods.filter((good) => {
      if (this.getOptionValue(target) === 'all' || this.getOptionValue(target) === 'collection') {
        good.classList.remove('filtered-by-collection');

        if (!good.classList.contains('filtered-by-material')) {
          good.classList.remove('hidden');
          return;
        } else {
          return;
        }
      }

      if (good.dataset.collection !== this.getOptionValue(target)) {
        good.classList.add('hidden');
        good.classList.add('filtered-by-collection');
      } else {
        if (!good.classList.contains('filtered-by-material')) {
          good.classList.remove('hidden');
        }
        good.classList.remove('filtered-by-collection');
      }
    });

    this.paramsFromUrl.set('collection', target.dataset.selectValue);
    window.history.replaceState(null, null, `${window.location.pathname}?${this.paramsFromUrl}`);

    this.isActive = true;
    this.hideDecorativeElements();

    if (this.isEmpty()) {
      this.addEmptyNotification();
    } else {
      this.removeEmptyNotification();
    }

  }

  filterSelectEvent() {
    if (!this.collectionFilter) {
      return;
    }

    const values = this.collectionFilter.querySelectorAll('.custom-select__item');

    values.forEach((value) => {
      value.addEventListener('click', (evt) => {
        this.filterByCollection(evt.target);
        this.selectValues['collection'] = this.getOptionValue(evt.target) === 'all' || this.getOptionValue(evt.target) === 'collection' ? true : false;
        this.checkSelectValues();
      });
    });
  }

  setMbMaterialEvent() {
    if (!this.mbMaterialFilter) {
      return;
    }

    const buttons = this.mbMaterialFilter.querySelectorAll('.jewelry-filters__filter-btn');

    buttons.forEach((button) => {
      button.addEventListener('click', (evt) => {
        this.mbFilterState.material = evt.target;
        this.selectValues['material'] = this.getOptionValue(evt.target) === 'all' || this.getOptionValue(evt.target) === 'material' ? true : false;
      });
    });
  }

  setMbCollectionEvent() {
    if (!this.mbCollectionFilter) {
      return;
    }

    const buttons = this.mbCollectionFilter.querySelectorAll('.jewelry-filters__filter-btn');

    buttons.forEach((button) => {
      button.addEventListener('click', (evt) => {
        this.mbFilterState.collection = evt.target;
        this.selectValues['collection'] = this.getOptionValue(evt.target) === 'all' || this.getOptionValue(evt.target) === 'collection' ? true : false;
      });
    });
  }

  setApplyEvent() {
    if (!this.applyBtn) {
      return;
    }

    this.applyBtn.addEventListener('click', () => {
      if (this.mbFilterState.collection) {
        this.filterByCollection(this.mbFilterState.collection);
      }

      if (this.mbFilterState.material) {
        this.filterByMaterial(this.mbFilterState.material);
      }

      this.checkSelectValues();
    });
  }
}
