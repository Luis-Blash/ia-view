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
      // demosSection.classList.add("invisible-display");
    })
    .catch((error) => {
      console.error("Error al acceder a la cámara web:", error);
    });
}
demosSection.classList.remove("invisible");

/*
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Obtener la imagen del lienzo como datos de píxeles
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Convertir los datos de píxeles a una matriz OpenCV
  const src = cv.matFromImageData(imageData);
  const dst = new cv.Mat();
  const dsize = new cv.Size(canvas.width * 0.5, canvas.height * 0.5);
  cv.resize(src, dst, dsize, 0, 0, cv.INTER_LINEAR);
  // Convertir la matriz OpenCV redimensionada a una imagen del lienzo
  const dstImageData = new ImageData(
    new Uint8ClampedArray(dst.data),
    dst.cols,
    dst.rows
  );
  // Dibujar la imagen redimensionada en el lienzo
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(dstImageData, 0, 0);
  // Liberar memoria
  src.delete();
  dst.delete();
*/

// play video
function captureFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Obtener la imagen del lienzo como datos de píxeles
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Convertir los datos de píxeles a una matriz OpenCV
  const src = cv.matFromImageData(imageData);

  // Obtener las dimensiones de la imagen
  const w = canvas.width;
  const h = canvas.height;

  // Crear una cuadrícula 2x2 para las vistas previas
  const grid = new cv.Mat.zeros(2 * h, 2 * w, cv.CV_8UC3);

  // Copiar la imagen original en la esquina superior izquierda de la cuadrícula
  const imageRegion = grid.roi(new cv.Rect(0, 0, w, h));
  src.copyTo(imageRegion);


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
