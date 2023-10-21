const initImgZoom = () => {
  const imgs = document.querySelectorAll('[data-mouse-zoom]');
  const breakpoint = window.matchMedia('(max-width:767px)');

  if (!imgs.length) {
    return;
  }

  const zoom = (e, block) => {
    const zoomer = block;
    const inner = block.querySelector('[data-inner-zoom]');

    let rect = block.getBoundingClientRect();
    let offsetX;
    let offsetY;

    if (e.touches) {
      offsetX = e.touches[0].pageX;
      offsetY = e.touches[0].pageY;
    } else {
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    }

    const multiplier = 1.4;

    const x = offsetX / zoomer.offsetWidth * 100;
    const y = offsetY / zoomer.offsetHeight * 100;
    const xOffset = -(x * multiplier - 20);
    const yOffset = -(y * multiplier - 20);

    if (!breakpoint.matches) {
      window.requestAnimationFrame(() => {
        inner.style.transform = `translate(${xOffset}%, ${yOffset}%)`;
      });
    }
  };

  const clearZoom = (block) => {
    block.style.left = '';
    block.style.top = '';
    block.style.transform = '';
  };

  imgs.forEach((img) => {
    const innerImg = img.querySelector('[data-inner-zoom]');

    img.addEventListener('click', (click) => {
      img.classList.toggle('active');

      setTimeout(() => {
        if (!img.classList.contains('active')) {
          clearZoom(innerImg);
        }
      }, 10);

      if (img.classList.contains('active')) {
        zoom(click, img);
      }

      img.addEventListener('mousemove', (e) => {
        if (img.classList.contains('active')) {
          zoom(e, img);
        }
      });

      img.addEventListener('mouseleave', () => {
        setTimeout(() => {
          img.classList.remove('active');
          clearZoom(innerImg);
        }, 10);
      });

      img.addEventListener('touchmove', (e) => {
        if (img.classList.contains('active')) {
          zoom(e, img);
        }
      });

      img.addEventListener('touchstart', () => {
        if (img.classList.contains('active')) {
          window.scrollLock.disableScrolling();
        }
      });

      img.addEventListener('touchend', () => {
        if (img.classList.contains('active')) {
          window.scrollLock.enableScrolling();
        }
      });
    });
  });
};

export {initImgZoom};
