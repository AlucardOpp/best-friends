let infiniteSequence;

const wrapper = document.querySelector('.wrapper');

const preloadImages = (frames, frameCount, sequencePath, imageFormat, framesLoaded, onComplete = () => { }) => new Promise((resolve) => {
  for (let i = 0; i <= frameCount; i++) {
    frames[i] = new Image();
    frames[i].src =
      `img/${sequencePath}/${i.toString().padStart(3, '0')}.${imageFormat}`;
    frames[i].onload = function () {
      framesLoaded++;
      if (framesLoaded >= frameCount - 1) {
        resolve();
      }
    };
  }
}).then(onComplete);

const setFrame = (canvas, context, frameIndex, frames) => {
  const index = frameIndex <= 0 || !frameIndex ? 1 : 0;
  const imgWidth = frames[index].width;
  const imgHeight = frames[index].height;
  const scale = getImageScale(canvas, frames[index]);

  const offsetY = canvas.height - imgHeight * scale;
  const offsetX = canvas.width - imgWidth * scale;

  context.drawImage(frames[index], offsetX / 2, offsetY / 2, imgWidth * scale, imgHeight * scale);
};

const getActiveFrame = (frameIndex, frames) => {
  const index = frameIndex <= 0 ? 1 : frameIndex;
  return frames[index];
};

const updateImage = (index, frames, context, canvas) => {
  const framesElements = !Array.isArray(frames) ? Object.values(frames)[0] : frames;
  if (framesElements[index]) {
    const imgWidth = framesElements[index].width;
    const imgHeight = framesElements[index].height;

    const scale = getImageScale(canvas, framesElements[index]);

    const offsetY = canvas.height - imgHeight * scale;
    const offsetX = canvas.width - imgWidth * scale;

    context.drawImage(framesElements[index], offsetX / 2, offsetY / 2, imgWidth * scale, imgHeight * scale);
  }
};

// const launchSequence = (frames, startFrameIndex, finalFrameIndex, context, canvas, onComplete = () => { }) => new Promise((resolve) => {
//   const isReverse = finalFrameIndex - startFrameIndex < 0;
//   let frame = startFrameIndex;

//   const initSequence = () => {
//     if (finalFrameIndex - startFrameIndex > 0) {
//       frame += 1;
//     } else {
//       frame -= 1;
//     }

//     if (!isReverse) {
//       if (frame < finalFrameIndex) {
//         updateImage(frame, frames, context, canvas);
//       } else {
//         resolve();
//         return;
//       }
//     } else {
//       if (frame > finalFrameIndex) {
//         updateImage(frame, frames, context, canvas);
//       } else {
//         resolve();
//         return;
//       }
//     }

//     requestAnimationFrame(initSequence);
//   };

//   initSequence();
// }).then(onComplete);

let activeInfiniteFrame;
let activeInfFrameIndex = 0;

const launchInfiniteSequence = (frames, startFrameIndex, finalFrameIndex, context, canvas, isReverse, isReplay, onComplete = () => { }) => new Promise((resolve) => {

  let frame = isReverse ? finalFrameIndex : startFrameIndex;

  if (isReplay) {
    frame = startFrameIndex;
  }

  const initSequence = () => {
    if (isReverse) {
      frame -= 1;
    } else {
      frame += 1;
    }

    if (!isReverse && frame === finalFrameIndex + 1) {
      frame = 0;
    }

    if (isReverse && frame === 0) {
      frame = finalFrameIndex;
    }

    updateImage(frame, frames, context, canvas);
    activeInfiniteFrame = frames[frame];
    activeInfFrameIndex = frame;

    infiniteSequence = requestAnimationFrame(initSequence);
  };

  initSequence();
}).then(onComplete);


const getImageScale = (canvas, activeFrame) => {
  if (activeFrame) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = activeFrame.width;
    const imgHeight = activeFrame.height;
    const scaleX = canvasWidth / imgWidth;
    const scaleY = canvasHeight / imgHeight;
    let scale = scaleX > scaleY ? scaleX : scaleY;
    return scale;
  }
};

const createSequenceAction = (item) => {
  const id = item.dataset.sequenceId;
  const canvas = item.querySelector('[data-sequence-canvas]');
  const loader = item.querySelector('[data-sequence-loader]');
  const parent = canvas.parentElement;
  const context = canvas.getContext('2d');
  const frameCount = +item.dataset.sequenceFrames;
  const sequencePath = item.dataset.sequencePath;
  const imageFormat = item.dataset.imageFormat;
  const frames = [];

  const isReverse = item.dataset.sequenceReverse === 'true';
  const isAutoplay = item.dataset.sequenceAutoplay === 'true';

  const isHoverPreload = item.dataset.hoverPreload;

  let isLoaded = false;
  let isMouseDown = false;
  let framesLoaded = 0;
  let activeFrame;
  let activeFrameIndex = 0;

  let scrollTop;
  let maxScrollTop;
  let scrollFraction;
  let frameIndex;
  let dif = 0;

  canvas.width = canvas.dataset.sequenceWidth ? +canvas.dataset.sequenceWidth : parent.offsetWidth;
  canvas.height = canvas.dataset.sequenceHeight ? +canvas.dataset.sequenceHeight : parent.offsetHeight;

  const getValues = () => {
    scrollTop = item.getBoundingClientRect().top * -1;
    maxScrollTop = item.scrollHeight - window.innerHeight;
    scrollFraction = scrollTop / maxScrollTop;
    frameIndex = Math.min(
        frameCount - 1,
        Math.ceil(scrollFraction * frameCount)
    );
  };

  getValues();

  if (!isHoverPreload) {
    preloadImages(frames, frameCount, sequencePath, imageFormat, framesLoaded, () => {
      setFrame(canvas, context, frameIndex, frames);
      activeFrame = getActiveFrame(frameIndex, frames);

      isLoaded = true;
    });
  }

  const onWindowResize = () => {
    if (activeFrame) {
      const scale = getImageScale(canvas, activeFrame);
      const resizedParent = canvas.parentElement;
      if (!canvas.dataset.sequenceWidth && !canvas.dataset.sequenceHeight) {
        canvas.width = resizedParent.offsetWidth;
        canvas.height = resizedParent.offsetHeight;
      }

      const offsetY = canvas.height - activeFrame.height * scale;
      const offsetX = canvas.width - activeFrame.width * scale;


      context.drawImage(activeFrame, offsetX / 2, offsetY / 2, activeFrame.width * scale, activeFrame.height * scale);
    }
  };

  const onMouseMoveItem = (evt) => {
    if (!isMouseDown) {
      return;
    }

    const rect = wrapper.getBoundingClientRect();
    const posX = evt.clientX;

    let hoverFraction = posX / rect.width;
    let frameIndexHover = Math.min(frameCount - 1, Math.ceil(hoverFraction * frameCount));
    let frameOffset = frameIndexHover + dif;

    if (frameOffset < 0) {
      frameOffset = frameCount + frameOffset;
    }

    if (frameOffset > frameCount) {
      frameOffset = frameOffset - frameCount;
    }

    requestAnimationFrame(() => updateImage(frameOffset, frames, context, canvas));

    activeFrame = frames[frameOffset];
    activeFrameIndex = frameOffset;
  };

  const onMouseHoverItem = (evt) => {
    if (!isMouseDown) {
      return;
    }

    const rect = item.getBoundingClientRect();
    const posX = evt.clientX - rect.left;

    let hoverFraction = posX / rect.width;
    let frameIndexHover = Math.min(frameCount - 1, Math.ceil(hoverFraction * frameCount));
    let frameOffset = frameIndexHover + dif;

    if (frameOffset < 0) {
      frameOffset = frameCount + frameOffset;
    }

    if (frameOffset > frameCount) {
      frameOffset = frameOffset - frameCount;
    }

    requestAnimationFrame(() => updateImage(frameOffset, frames, context, canvas));

    activeFrame = frames[frameOffset];
    activeFrameIndex = frameOffset;
  };

  const onTouchMoveItem = (evt) => {
    if (!isMouseDown) {
      return;
    }

    const rect = wrapper.getBoundingClientRect();
    const touch = evt.touches[0];
    const posX = touch.clientX;

    let hoverFraction = posX / rect.width;
    let frameIndexHover = Math.min(frameCount - 1, Math.ceil(hoverFraction * frameCount));
    let frameOffset = frameIndexHover + dif;

    if (frameOffset < 0) {
      frameOffset = frameCount + frameOffset;
    }

    if (frameOffset > frameCount) {
      frameOffset = frameOffset - frameCount;
    }

    requestAnimationFrame(() => updateImage(frameOffset, frames, context, canvas));

    activeFrame = frames[frameOffset];
    activeFrameIndex = frameOffset;
  };

  const onMouseOutItem = () => {
    if (isMouseDown) {
      isMouseDown = false;
      if (isAutoplay) {
        launchInfiniteSequence(frames, activeFrameIndex, frameCount, context, canvas, isReverse, true);
      }
    }
  };

  const onTouchInItem = (evt) => {
    if (item.dataset.hoverSequence) {
      if (!isLoaded) {
        if (loader) {
          loader.classList.remove('hidden');
        }
        preloadImages(frames, frameCount, sequencePath, imageFormat, framesLoaded, () => {
          setFrame(canvas, context, frameIndex, frames);
          activeFrame = getActiveFrame(frameIndex, frames);

          isLoaded = true;

          loader.classList.add('hidden');
        });
      }
    }

    if (evt.target.closest('[data-sequence]') && isAutoplay) {
      isMouseDown = true;
      const rect = wrapper.getBoundingClientRect();
      const touch = evt.touches[0];
      const posX = touch.clientX;

      let hoverFraction = posX / rect.width;

      dif = activeInfFrameIndex - Math.ceil(hoverFraction * frameCount);

      cancelAnimationFrame(infiniteSequence);
    }

    if (evt.target.closest('[data-sequence]') && !isAutoplay) {
      isMouseDown = true;

      const rect = wrapper.getBoundingClientRect();
      const touch = evt.touches[0];
      const posX = touch.clientX;

      let hoverFraction = posX / rect.width;

      dif = activeFrameIndex - Math.ceil(hoverFraction * frameCount);
    }
  };

  const onMouseInItem = (evt) => {
    if (evt.target.closest('[data-sequence]') && isAutoplay) {
      isMouseDown = true;
      const rect = wrapper.getBoundingClientRect();
      const posX = evt.clientX;

      let hoverFraction = posX / rect.width;

      dif = activeInfFrameIndex - Math.ceil(hoverFraction * frameCount);

      cancelAnimationFrame(infiniteSequence);
    }

    if (evt.target.closest('[data-sequence]') && !isAutoplay) {
      isMouseDown = true;

      const rect = wrapper.getBoundingClientRect();
      const posX = evt.clientX;

      let hoverFraction = posX / rect.width;

      dif = activeFrameIndex - Math.ceil(hoverFraction * frameCount);
    }
  };

  const onMouseHoverInItem = (evt) => {
    if (evt.target.closest('[data-sequence]') && !isAutoplay) {
      isMouseDown = true;

      const rect = item.getBoundingClientRect();
      const posX = evt.clientX - rect.left;

      let hoverFraction = posX / rect.width;

      dif = activeFrameIndex - Math.ceil(hoverFraction * frameCount);
    }
  };

  if (isAutoplay) {
    launchInfiniteSequence(frames, 0, frameCount, context, canvas, isReverse, false);
  }

  const onMouseenterItem = () => {
    if (!isLoaded) {
      if (loader) {
        loader.classList.remove('hidden');
      }
      preloadImages(frames, frameCount, sequencePath, imageFormat, framesLoaded, () => {
        setFrame(canvas, context, frameIndex, frames);
        activeFrame = getActiveFrame(frameIndex, frames);

        isLoaded = true;

        loader.classList.add('hidden');
      });
    }
  };

  if (item.dataset.hoverSequence) {
    isMouseDown = true;
    item.addEventListener('mousemove', onMouseHoverItem);
    item.addEventListener('mouseover', onMouseHoverInItem);
    item.addEventListener('mouseenter', onMouseenterItem);
  }

  if (item.dataset.mousedownSequence) {
    window.addEventListener('mousemove', onMouseMoveItem);
    window.addEventListener('mousedown', onMouseInItem);
    window.addEventListener('mouseup', onMouseOutItem);
  }

  if (item.dataset.mousedownSequence || item.dataset.hoverSequence) {
    item.addEventListener('touchstart', onTouchInItem);
    // item.addEventListener('touchend', onMouseOutItem);
    item.addEventListener('touchmove', onTouchMoveItem);
    window.addEventListener('resize', onWindowResize);
  }
};


export default class Sequence {
  constructor() {
    window.sequenceInit = this.init.bind(this);
  }

  createSequence(item) {
    createSequenceAction(item);
    return item;
  }

  init() {
    const sequences = document.querySelectorAll('[data-sequence]');
    sequences.forEach((sequence) => {
      if (!sequence.classList.contains('is-initialized')) {
        const newSequence = this.createSequence(sequence);
        sequence.classList.add('is-initialized');
      }
    });
  }
}

const initSequence = () => {
  const sequence = new Sequence();
  sequence.init();
};

export {initSequence};
