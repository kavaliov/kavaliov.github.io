function timeline({containerId, frameFolder = "data", firstFrameName, frameCount = 0, fps = 24, autoPlay = true}) {

  if (!containerId) {
    console.warn("Please, set containerId");
    return;
  }

  if (!firstFrameName) {
    console.warn("Please, set firstFrameName");
    return;
  }

  if (frameFolder === "data") {
    console.warn("frameFolder set by default to 'data'");
  }

  let currentFrame = 0;
  let isPlaying = false;

  const initLayout = (layoutContainer, rangeMax) => {
    const container = document.getElementById(layoutContainer);
    container.classList.add("timelineWrapper");

    // progress bar
    const progressBar = document.createElement("div");
    progressBar.classList.add("progressBar");

    // image
    const image = document.createElement("img");
    image.src = `${window.location.href}${frameFolder}/${firstFrameName}`;
    image.classList.add("timelineImage");

    // controls wrapper
    const controlsWrapper = document.createElement("div");
    controlsWrapper.classList.add("controlsWrapper");
    controlsWrapper.classList.add("hidden");

    // play button
    const playButton = document.createElement("button");
    playButton.classList.add("playButton");
    playButton.innerText = "Play";

    // range control
    const rangeControl = document.createElement("input");
    rangeControl.classList.add("rangeControl");
    rangeControl.type = "range";
    rangeControl.value = "0";
    rangeControl.min = "0";
    rangeControl.max = String(rangeMax - 1);

    controlsWrapper.appendChild(playButton);
    controlsWrapper.appendChild(rangeControl);

    container.appendChild(image);
    container.appendChild(progressBar);
    container.appendChild(controlsWrapper);

    return {image, progressBar, controlsWrapper, rangeControl, playButton};
  };

  const setProgressLoading = (percentage) => {
    progressBar.style.width = percentage + "%";

    if (percentage === 0) {
      controlsWrapper.classList.remove("hidden");
      progressBar.remove();
      if (autoPlay) playerStart();
    }
  }

  const generateFrameData = (folder = "", file = "", count = 0) => {
    const lastDotIndex = file.lastIndexOf('.');
    const name = file.substr(0, lastDotIndex - 5);
    const ext = file.substr(lastDotIndex, file.length - lastDotIndex);
    let data = [];

    for (let i = 0; i < count; i++) {
      data.push(`./${folder}/${name}.${("000" + i).slice(-4)}${ext}`);
    }

    return {data, name, ext};
  }

  const cacheImages = (frameData) => {

    if (!cacheImages.list) {
      cacheImages.list = [];
    }
    let list = cacheImages.list;
    for (let i = 0; i < frameData.length; i++) {

      let img = new Image();
      img.onload = function () {
        let index = list.indexOf(this);
        if (index !== -1) {
          list.splice(index, 1);
        }
        setProgressLoading(100 * list.length / frameData.length);
      }

      list.push(img);
      img.src = frameData[i];
    }
  }

  const setFrame = (frame) => {
    currentFrame = frame;
    rangeControl.value = frame;
    image.src = `./${frameFolder}/${fileNamePattern}.${("000" + frame).slice(-4)}${fileExt}`;
  }

  const player = () => {
    let interval;

    const start = () => {
      isPlaying = true;
      playButton.innerText = "Pause";
      interval = setInterval(() => {
        if (currentFrame < frameCount - 1) {
          currentFrame += 1;
        } else {
          currentFrame = 0;
        }
        setFrame(currentFrame);
      }, 1000 / fps);
    }

    const pause = () => {
      clearInterval(interval);
      isPlaying = false;
      playButton.innerText = "Play";
    }

    return {start, pause};
  };


  const {data: frameData, name: fileNamePattern, ext: fileExt} = generateFrameData(frameFolder, firstFrameName, frameCount);
  const {image, progressBar, controlsWrapper, playButton, rangeControl} = initLayout(containerId, frameCount);
  const {start: playerStart, pause: playerPause} = player();
  cacheImages(frameData);

  rangeControl.addEventListener("input", function () {
    playerPause();
    setFrame(+this.value);
  })

  playButton.addEventListener("click", function () {
    if (isPlaying) {
      playerPause();
    } else {
      playerStart();
    }
  });
}
