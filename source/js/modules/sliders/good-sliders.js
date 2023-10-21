const sliders = document.querySelectorAll('.good__swiper');
const breakpoint = window.matchMedia('(max-width:1023px)');

const initSliders = () => {
  sliders.forEach((slider) => {
    // eslint-disable-next-line
    const isTouchMove = !slider.classList.contains('good__swiper--sequence');

    const swiper = new Swiper(slider, {
      slidesPerView: 1,
      allowTouchMove: isTouchMove,
      pagination: {
        el: '.good__pagination',
        type: 'bullets',
        clickable: true,
      },
    });
  });
};

const breakpointChecker = () => {
  if (breakpoint.matches) {
    initSliders();
  } else {
    sliders.forEach((slider) => {
      if (slider.swiper) {
        slider.swiper.destroy();
      }
    });
  }
};

const goodSliders = () => {
  if (!sliders.length) {
    return;
  }

  breakpointChecker();
  breakpoint.addListener(breakpointChecker);
};

export {goodSliders};
