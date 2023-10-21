export const initHoverVideo = () => {
  const goods = document.querySelectorAll('.good--hover-video');

  if (!goods.length) {
    return;
  }

  goods.forEach((good) => {
    good.addEventListener('mouseenter', () => enableVideo(good), {capture: false});
    good.addEventListener('mouseleave', () => disableHover(good));
  });

  const enableVideo = (wrapper) => {
    const loader = wrapper.querySelector('[data-video-loader]');
    const video = wrapper.querySelector('[data-bg-video]');

    if (!video) {
      return;
    }

    loader.classList.remove('hidden');

    const handelLoad = () => {
      loader.classList.add('hidden');
      wrapper.classList.add('is-active');
      video.play();
    };

    video.src = video.dataset.videoSrc;
    video.onloadeddata = handelLoad;
  };

  const disableHover = (wrapper) => {
    wrapper.classList.remove('is-active');
  };
};
