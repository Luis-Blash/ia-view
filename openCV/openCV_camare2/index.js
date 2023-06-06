const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const demosSection = document.getElementById("demos");
const enableWebcamButton = document.getElementById("webcamButton");

function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

function enableCam(event) {
  if (!model) {
    return;
  }
  event.target.classList.add("removed");
  const constraints = {
    video: true,
  };
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

function predictWebcam() {}

var model = true;
demosSection.classList.remove("invisible");

function opencvcheck() {
  document.getElementById("checker").innerHTML = "Opencv is Ready.";
}

// inputs
let imgElement = document.getElementById("imageSrc");
let inputElement = document.getElementById("fileInput");
inputElement.addEventListener(
  "change",
  (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  },
  false
);
imgElement.onload = function () {
  let src = cv.imread(imgElement);
  let dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow("canvasOutput", dst);
  src.delete();
  dst.delete();
};
