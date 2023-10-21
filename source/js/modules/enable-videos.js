const enableVideos = () => {
  const videos = document.querySelectorAll('.good__background-image--video');

  if (!videos.length) {
    return;
  }

  videos.forEach((elem) => {
    const video = elem.firstElementChild;
    video.src = video.dataset.videoSrc;
  });
};

export {enableVideos};
