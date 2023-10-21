const mainNav = document.querySelector('.main-nav');
const menuBtn = document.querySelector('.main-nav__toggle');
const body = document.querySelector('body');

const initMainNav = () => {
  if (!menuBtn) {
    return;
  }

  menuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('is-active');
    if (mainNav.classList.contains('is-active')) {
      const box = document.querySelector('.wrapper');
      const scrollbarWidth = box.offsetWidth - box.clientWidth;
      body.classList.add('scroll-lock');
      body.style.paddingRight = scrollbarWidth;
      window.scrollLock.disableScrolling();
      window.focusLock.lock('.header', false);
    } else {
      const scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
      body.classList.remove('scroll-lock');
      body.style.paddingRight = scrollbarWidth;
      window.scrollLock.enableScrolling();
      window.focusLock.unlock(false);
    }
  });
};

const outsideClick = () => {
  document.addEventListener('click', (evt) => {
    if (!mainNav) {
      return;
    }

    if (mainNav.classList.contains('is-active')) {
      if (!(evt.target.classList.contains('main-nav__wrapper')) && !(evt.target.classList.contains('main-nav__toggle'))) {
        mainNav.classList.remove('is-active');
        const scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
        body.classList.remove('scroll-lock');
        body.style.paddingRight = scrollbarWidth;
        window.scrollLock.enableScrolling();
        window.focusLock.unlock(false);
      }
    }
  });
};

const mainNavToggle = () => {
  if (!mainNav) {
    return;
  }

  const breakpoint = window.matchMedia('(max-width:1023px)');
  const breakpointChecker = () => {
    if (!breakpoint.matches) {
      mainNav.classList.remove('is-active');
      const scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
      body.classList.remove('scroll-lock');
      body.style.paddingRight = scrollbarWidth;
      window.scrollLock.enableScrolling('header');
      window.focusLock.unlock(false);
    }
  };

  breakpoint.addListener(breakpointChecker);

  outsideClick();
  initMainNav();
  breakpointChecker();
};

export {mainNavToggle};
