const initProductPriceBtns = () => {
  const productPriceBtns = document.querySelector('.product__btns');
  const body = document.querySelector('body');
  const header = document.querySelector('.header');

  if (!productPriceBtns) {
    return;
  }

  const checkActivePriceBtns = () => {
    const isBtnsTopWithHeader = !body.classList.contains('.header-top') && productPriceBtns.getBoundingClientRect().top < (header.offsetHeight + 1);
    const isBtnsTopWithoutHeader = body.classList.contains('.header-top') && productPriceBtns.getBoundingClientRect().top === 1;

    if (isBtnsTopWithoutHeader || isBtnsTopWithHeader) {
      productPriceBtns.classList.add('active');
      return;
    }

    productPriceBtns.classList.remove('active');
  };

  window.addEventListener('scroll', () => {
    checkActivePriceBtns();
  });
};

export {initProductPriceBtns};
