document.addEventListener("DOMContentLoaded", () => {
  const points = document.getElementsByClassName("point");
  const popup = document.getElementById("timeline-wrapper");
  let pause;

  const seqCount = {
    "INT3D-4": 306,
    "INT3D-5": 306,
    "INT3D-6": 286,
    "INT3D-7": 301,
    "INT3D-9": 251,
    "INT3D-10": 251,
  }

  const generatePeriods = (seq) => {
    const interval = Math.floor(seq / 51);
    const period = {};
    let currentFrame = 0;

    for (let i = 50; i > 0; i--) {
      period[currentFrame] = `${i} million years ago`;
      currentFrame += interval;
    }

    period[currentFrame + interval] = "Present Time";

    return period;
  }

  const showVideo = (id) => {
    document.getElementById("timeline").innerHTML = "";
    popup.classList.add("opened");

    const {playerPause} = timeline({
      containerId: "timeline",
      framesFolder: `media/${id}`,
      fps: 15,
      framesCount: seqCount[id] - 1,
      firstFrameName: `${id}.0000.jpg`,
      periods: generatePeriods(seqCount[id])
    });

    pause = playerPause;
  };

  const closePopUp = () => {
    if (popup.classList.contains("opened")) {
      pause();
      popup.classList.remove("opened");
      document.getElementById("timeline").innerHTML = "";
    }
  }

  for (let point of points) {
    point.addEventListener("click", () => {
      showVideo(point.getAttribute("data-point"))
    });
  }

  document.getElementById("map").addEventListener("click", () => {
    closePopUp();
  })

  document.getElementById("closeButton").addEventListener("click", () => {
    closePopUp();
  });
});
