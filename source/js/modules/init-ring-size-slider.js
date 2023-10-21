const initRingSizeSlider = () => {
  const sliderBlocks = document.querySelectorAll('.ring-size-slider');

  if (!sliderBlocks.length) {
    return;
  }

  const minValue = 0.5;
  const maxValue = 8;
  const startValue = 3.5;
  const step = 0.5;

  sliderBlocks.forEach((sliderBlock) => {
    const sliderLine = sliderBlock.querySelector('.ring-size-slider__slider-line');
    const sliderNumber = sliderBlock.querySelector('.ring-size-slider__number');
    const ring = sliderBlock.querySelector('.ring-size-slider__img-ring-inner');
    const info = sliderBlock.querySelector('.ring-size-slider__slider-info');

    const slider = noUiSlider.create(sliderLine, {
      start: startValue,
      orientation: 'vertical',
      range: {
        'min': minValue,
        'max': maxValue,
      },
      step,
    });

    slider.on('update', function (values) {
      const value = Number(values[0]);
      const percent = Number(value / (maxValue) * 100).toFixed(2);
      const ringScale = (value) / 20 + 0.6;

      sliderNumber.textContent = value.toFixed(1);
      ring.style.transform = `scale(${ringScale})`;
      info.style.top = `${percent}%`;
    });
  });
};

export {initRingSizeSlider};
