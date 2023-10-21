const initHeader = () => {
  const header = document.querySelector('.header');
  const body = document.querySelector('body');

  if (!header) {
    return;
  }

  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  document.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > lastScrollTop) {
      if (window.pageYOffset > 50) {
        header.classList.add('header--top');
        body.classList.add('header-top');
      }
    } else {
      header.classList.remove('header--top');
      body.classList.remove('header-top');
    }

    lastScrollTop = st <= 0 ? 0 : st;

    if (window.scrollY > 50) {
      header.classList.add('fixed');
    } else {
      header.classList.remove('fixed');
    }
  });
};

export {initHeader};
