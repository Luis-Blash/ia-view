var modelo = null;

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
      demosSection.classList.add("invisible-display");
    })
    .catch((error) => {
      console.error("Error al acceder a la cámara web:", error);
    });
}
demosSection.classList.remove("invisible");

// Preprocesa el contenido del lienzo (canvas)
function preprocessCanvas(canvas) {
  const tensor = tf.browser.fromPixels(canvas).toFloat();
  const resized = tf.image.resizeBilinear(tensor, [64, 64]);
  const normalized = resized.div(255.0);
  const batched = normalized.expandDims(0);
  return batched;
}

// Variables para almacenar la posición y el tamaño del objeto detectado
let detectedObject = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

// Función para realizar inferencias con el lienzo (canvas)
function predictFromCanvas(canvas) {
  const preprocessedImage = preprocessCanvas(canvas);
  const predictions = modelo.predict(preprocessedImage);
  // Obtiene la etiqueta predicha
  const label = predictions.round().dataSync()[0];
  // Muestra la etiqueta predicha
  console.log("Etiqueta predicha:", label);
  // Dibuja un rectángulo alrededor del objeto detectado (si es un mouse)
  if (label === 0) {
    console.log(predictions);
    const boundingBox = getObjectBoundingBox(predictions);
    drawDetectedObject(ctx, boundingBox); // Dibuja el cuadro alrededor del objeto detectado
  }
}

// Función para dibujar el cuadro alrededor del objeto detectado
function drawBoundingBox(ctx, boundingBox) {
  console.log(boundingBox);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(
    1,
    1,
    20,
    20
  );
  ctx.stroke();
}

// Función para obtener la posición y el tamaño del objeto detectado
function getObjectBoundingBox(predictions) {
  const threshold = 0.5; // Umbral de confianza para considerar una detección válida
  const [height, width, channels] = predictions.shape;

  const data = predictions.dataSync(); // Obtener los valores de las predicciones

  // Variables para almacenar la posición y el tamaño del objeto detectado
  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;

  // Recorre todas las detecciones en las predicciones
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const confidence = data[y * width + x]; // Obtener el valor de confianza en la posición actual

      // Verifica si la detección supera el umbral de confianza
      if (confidence > threshold) {
        // Actualiza las coordenadas del objeto detectado si es necesario
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }

  // Devuelve el rectángulo del objeto detectado
  return { left, top, right, bottom };
}

// Dibuja el cuadro alrededor del objeto detectado en el lienzo
function drawDetectedObject(ctx, boundingBox) {
  drawBoundingBox(ctx, boundingBox);
}


function captureFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Realiza la inferencia con el lienzo
  predictFromCanvas(canvas);

  requestAnimationFrame(captureFrame);
}
video.addEventListener("play", () => {
  requestAnimationFrame(captureFrame);
});

//Cargar modelo
(async () => {
  console.log("Cargando modelo...");
  modelo = await tf.loadLayersModel("model.json");
  console.log("Modelo cargado...");
})();
