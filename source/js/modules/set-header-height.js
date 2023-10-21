const body = document.querySelector('body');
const header = document.querySelector('.header');

const setHeaderHeight = () => {
  if (!header) {
    return;
  }

  let headerHeight = header.getBoundingClientRect().height;

  body.style.setProperty('--headerHeight', headerHeight + 'px');

  const ro = new ResizeObserver((entries) => {
    for (let entry of entries) {
      let newHeight = entry.contentRect.height;

      if (headerHeight !== newHeight) {
        body.style.setProperty('--headerHeight', newHeight + 'px');
        headerHeight = newHeight;
      }
    }
  });

  ro.observe(header);
};

export {setHeaderHeight};
