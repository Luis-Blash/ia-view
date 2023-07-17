var model = null;
var imagenSeleccionada = null;

// Cargar modelo
(async () => {
  console.log("Cargando modelo...");
  model = await tf.loadGraphModel("./web_model/model.json");
  console.log("Modelo cargado...");
})();

// Function to load image preview
function loadPreview(event) {
  var image = document.getElementById("image-preview");
  image.src = URL.createObjectURL(event.target.files[0]);
}

// Function to process predictions and draw bounding boxes
async function processPredictions(predictions, canvas) {
  console.log(predictions);
  // Obtén los tensores de las predicciones
  const scoresTensor = predictions[0];
  const classesTensor = predictions[1];
  const boxesTensor = predictions[2];

  // Obtén los valores de los tensores como arreglos de JavaScript
  const scoresArray = await scoresTensor.array();
  const classesArray = await classesTensor.array();
  const boxesArray = await boxesTensor.array();

  const ctx = canvas.getContext("2d");

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Definir estilos para los cuadros delimitadores
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.font = "16px Arial";

  // Iterar sobre las predicciones
  for (let i = 0; i < scoresArray.length; i++) {
    const score = scoresArray[i];
    const classIndex = classesArray[i];
    const [yMin, xMin, yMax, xMax] = boxesArray[i];

    console.log(boxesArray[i], i);
    console.log("yMin", yMin);
    console.log("xMin", xMin);
    console.log("yMax", yMax);
    console.log("xMax", xMax);

    // Dibujar el cuadro delimitador
    const x = xMin * canvas.width;
    const y = yMin * canvas.height;
    const width = (xMax - xMin) * canvas.width;
    const height = (yMax - yMin) * canvas.height;

    console.log(xMin, canvas.width, x);
    // ctx.beginPath();
    // ctx.rect(x, y, width, height);
    // ctx.stroke();

    // // Mostrar la etiqueta y la puntuación
    // const label = `Class ${classIndex} (${score.toFixed(2)})`;
    // ctx.fillText(label, x, y > 10 ? y - 5 : y + height + 16);
  }
}

function stringifySafe(obj) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        // Si encuentra una referencia circular, excluye la propiedad
        return undefined;
      }
      cache.add(value);
    }
    return value;
  });
}

// Function to detect objects
async function detectObjects() {
  console.log(model);
  var json_str = stringifySafe(model);
  console.log(json_str);
  // Crear un elemento de textarea temporal
  var textarea = document.createElement("textarea");
  textarea.value = json_str;

  // Agregar el textarea al DOM
  document.body.appendChild(textarea);

  // Seleccionar y copiar el contenido del textarea
  textarea.select();
  document.execCommand("copy");

  // Eliminar el textarea temporal
  document.body.removeChild(textarea);

  let struaux = {};

  for (const key in model) {
    if (Object.hasOwnProperty.call(model, key)) {
      const element = model[key];
      console.log(key, ":");
      console.log(element);
      console.log(typeof element);
      if (typeof element === "object") {
      }
    }
  }
  console.log(struaux);
  // var imagePreview = document.getElementById("image-preview");
  // var canvas = document.getElementById("canvas");
  // var context = canvas.getContext("2d");

  // // Obtén la imagen del contexto y conviértela a un tensor
  // const imageTensor = tf.browser.fromPixels(imagePreview);
  // // Preprocesa la imagen antes de pasarla al modelo
  // const preprocessedImage = tf.image.resizeBilinear(imageTensor, [320, 320]);
  // const normalizedImage = preprocessedImage.div(255).expandDims();

  // // Convertir normalizedImage a int32
  // const int32Image = normalizedImage.cast("int32");

  // const predictions = await model.executeAsync({ input_tensor: int32Image });

  // // Procesa las predicciones y dibuja los bounding boxes en el canvas
  // processPredictions(predictions, canvas);

  // // Libera los recursos de los tensores
  // tf.dispose([imageTensor, preprocessedImage, normalizedImage, int32Image]);
}

// Event listeners
document.getElementById("image-input").addEventListener("change", loadPreview);
document
  .getElementById("detect-button")
  .addEventListener("click", detectObjects);
