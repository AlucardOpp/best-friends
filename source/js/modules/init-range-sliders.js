const colors = [
  'D',
  'E',
  'F',
  'G',
  'J',
  'H',
  'I',
  'K',
  'L',
  'M',
  'N'
];

const purityList = [
  'VVS2',
  'VVS1',
  'VS1',
  'VS2',
  'S13',
  'S11',
  'S12'
];

let rangeSlides = [];

const initSizeSlider = (slider) => {
  const min = slider.dataset.sliderMin;
  const max = slider.dataset.sliderMax;
  const startMin = slider.dataset.sliderStartMin;
  const startMax = slider.dataset.sliderStartMax;
  const step = slider.dataset.sliderStep;
  const inputStart = slider.querySelector('[data-range-start-input]');
  const inputEnd = slider.querySelector('[data-range-end-input]');

  const rangeSlider = noUiSlider.create(slider, {
    start: [startMin, startMax],
    connect: true,
    tooltips: [true, true],
    step: Number(step),
    range: {
      'min': [Number(min)],
      'max': [Number(max)],
    },
    format: {
      // 'to' the formatted value. Receives a number.
      to(value) {
        return value.toFixed(1);
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from(value) {
        return Number(value);
      },
    },
  });

  rangeSlider.on('update', (values, handle) => {
    inputStart.value = values[0];
    inputEnd.value = values[1];
  });

  return rangeSlider;
};

const initListSlider = (slider, list) => {
  const startMin = slider.dataset.sliderStartMin;
  const startMax = slider.dataset.sliderStartMax;
  const inputStart = slider.querySelector('[data-range-start-input]');
  const inputEnd = slider.querySelector('[data-range-end-input]');

  const rangeSlider = noUiSlider.create(slider, {
    start: [startMin, startMax],
    connect: true,
    step: 1,
    range: {
      'min': [0],
      'max': [list.length - 1],
    },
    pips: {
      mode: 'steps',
      density: 10,
      format: {
        // 'to' the formatted value. Receives a number.
        to(value) {
          return list[value];
        },
        // 'from' the formatted value.
        // Receives a string, should return a number.
        from(value) {
          return Number(value);
        },
      },
    },
  });

  rangeSlider.on('update', (values, handle) => {
    const markers = slider.querySelectorAll('.noUi-value');
    const handleLower = slider.querySelector('.noUi-handle-lower');
    const handleUpper = slider.querySelector('.noUi-handle-upper');

    inputStart.value = values[0];
    inputEnd.value = values[1];

    setTimeout(() => {
      markers.forEach((marker) => {
        marker.classList.add('active');

        if ((marker.getBoundingClientRect().left + marker.offsetWidth / 2) < handleLower.getBoundingClientRect().left) {
          marker.classList.remove('active');
        }

        if ((marker.getBoundingClientRect().right - marker.offsetWidth / 2) > handleUpper.getBoundingClientRect().right) {
          marker.classList.remove('active');
        }
      });
    }, 200);
  });

  return rangeSlider;
};

const initRangeSliders = () => {
  const sliders = document.querySelectorAll('[data-range-slider]');

  sliders.forEach((slider) => {
    const sliderType = slider.dataset.rangeSlider;

    switch (sliderType) {
      case ('size'):
        const sizeSlider = initSizeSlider(slider);
        rangeSlides.push(sizeSlider);
        break;
      case ('color'):
        const colorSlider = initListSlider(slider, colors);
        rangeSlides.push(colorSlider);
        break;
      case ('purity'):
        const puritySlider = initListSlider(slider, purityList);
        rangeSlides.push(puritySlider);
        break;
    }
  });

  // reset sliders
  const resetBtn = document.querySelector('[data-reset-sliders]');

  if (!resetBtn) {
    return;
  }

  resetBtn.addEventListener('click', () => {
    rangeSlides.forEach((slider) => {
      slider.reset();
    });
  });
};

export {initRangeSliders};
