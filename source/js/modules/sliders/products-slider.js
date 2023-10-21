const sliders = document.querySelectorAll('.slider-products');

const initSlider = (sliderBlock) => {
  const slider = sliderBlock.querySelector('.slider-products__swiper');
  const prevBtn = sliderBlock.querySelector('.slider-products__navigation-button--prev');
  const nextBtn = sliderBlock.querySelector('.slider-products__navigation-button--next');

  // eslint-disable-next-line
  const swiper = new Swiper(slider, {
    slidesPerView: 'auto',
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
  });
};

const productsSlider = () => {
  if (!sliders.length) {
    return;
  }

  sliders.forEach(initSlider);
};

export {productsSlider};
