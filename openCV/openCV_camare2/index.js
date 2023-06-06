const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const demosSection = document.getElementById("demos");
const enableWebcamButton = document.getElementById("webcamButton");
const canvas = document.getElementById("canvasElement1");
const ctx = canvas.getContext("2d");

function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

function enableCam(event) {
  event.target.classList.add("removed");
  const constraints = {
    video: true,
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      //* comentar para ver camara
      demosSection.classList.add('invisible-display')
    })
    .catch((error) => {
      console.error("Error al acceder a la cámara web:", error);
    });
}
demosSection.classList.remove("invisible");

// play video
function captureFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Obtener la imagen del lienzo como datos de píxeles
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Convertir los datos de píxeles a una matriz OpenCV
  const src = cv.matFromImageData(imageData);
  // Aplicar manipulaciones de OpenCV a la imagen (por ejemplo, convertir a escala de grises)
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  // Dibujar la imagen procesada en el lienzo
  cv.imshow(canvas, gray);
  // Liberar memoria
  src.delete();
  gray.delete();
  requestAnimationFrame(captureFrame);
}
video.addEventListener("play", () => {
  requestAnimationFrame(captureFrame);
});

// open cvs

function opencvcheck() {
  document.getElementById("checker").innerHTML = "Opencv is Ready.";
}

// inputs
// let imgElement = document.getElementById("imageSrc");
// let inputElement = document.getElementById("fileInput");
// inputElement.addEventListener(
//   "change",
//   (e) => {
//     imgElement.src = URL.createObjectURL(e.target.files[0]);
//   },
//   false
// );
// imgElement.onload = function () {
//   let src = cv.imread(imgElement);
//   let dst = new cv.Mat();
//   cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
//   cv.imshow("canvasOutput", dst);
//   src.delete();
//   dst.delete();
// };
