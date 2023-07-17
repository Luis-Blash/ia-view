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

async function predict(model, image, confidenceThreshold) {
  // Crear un tensor a partir del canvas
  const tensor = tf.browser.fromPixels(image).toFloat();

  // Redimensionar la imagen capturada al tamaño esperado por el modelo (64x64)
  const resizedImage = tf.image.resizeBilinear(tensor, [64, 64]);

  const img = resizedImage.expandDims();
  const predictions = await model.predict(img).data();

  // Verificar si la confianza de la predicción supera el umbral establecido
  const confidence = predictions[0]; // Suponiendo que solo hay una predicción
  const isObjectDetected = confidence >= confidenceThreshold;

  return {
    predictions,
    isObjectDetected,
  };
}

async function classifyImage() {
  // Definir el umbral de confianza deseado
  const confidenceThreshold = 0.5;

  // Llamar a la función predict y obtener los resultados
  const predictionResult = await predict(modelo, canvas, confidenceThreshold);

  // Verificar si se detectó un objeto
  if (predictionResult.isObjectDetected) {
    console.log("¡Se detectó un objeto!");
    // Realizar las acciones deseadas cuando se detecte un objeto
  } else {
    console.log("No se detectó ningún objeto.");
    // Realizar las acciones deseadas cuando no se detecte ningún objeto
  }
  // const predictionDiv = document.getElementById('prediction');
  // predictionDiv.innerHTML = 'Predictions: ' + predictions;
}

async function captureFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  await classifyImage();

  requestAnimationFrame(captureFrame);
}
video.addEventListener("play", () => {
  requestAnimationFrame(captureFrame);
});

//Cargar modelo
(async () => {
  console.log("Cargando modelo...");
  modelo = await tf.loadLayersModel("./models/model.json");
  console.log("Modelo cargado...");
})();
