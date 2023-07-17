var modelo = null;
var imagenSeleccionada = null;

// Cargar modelo
(async () => {
  console.log("Cargando modelo...");
  modelo = await tf.loadGraphModel("./web_model/model.json");
  console.log("Modelo cargado...");
})();

function cargarImagen(event) {
  const archivo = event.target.files[0];
  const lector = new FileReader();
  lector.onload = function (e) {
    const imagen = document.getElementById("imagen");
    imagen.src = e.target.result;
    imagenSeleccionada = e.target.result;
  };
  lector.readAsDataURL(archivo);
}

async function realizarPrediccion() {
  // Mostrar los resultados en el canvas
  const canvas = document.getElementById("canvas");
  const contexto = canvas.getContext("2d");
  if (!modelo) {
    console.log("El modelo no está cargado aún");
    return;
  }
  if (!imagenSeleccionada) {
    console.log("No se ha seleccionado ninguna imagen");
    return;
  }

  const imagen = document.getElementById("imagen");

  // Crear un tensor de la imagen
  const tensor = tf.browser.fromPixels(imagen);

  // Redimensionar y normalizar la imagen
  const resizedTensor = tensor.resizeBilinear([640, 640]).toFloat().div(255);

  // Convertir el tensor a int32
  const int32Tensor = resizedTensor.mul(255).toInt();

  // Agregar una dimensión al tensor de entrada para que tenga forma [1, altura, ancho, 3]
  const inputTensor = int32Tensor.expandDims();

  // Realizar la predicción
  const resultados = await modelo.executeAsync(inputTensor);
  console.log(resultados);

  // Obtén las coordenadas de los objetos detectados
  const detecciones = resultados[1].dataSync(); // Suponiendo que los datos de detección están en la segunda estructura de resultados

  console.log(detecciones);
  // Dibuja los cuadros delimitadores en el canvas
  for (let i = 0; i < detecciones.length; i++) {
    const x = detecciones[i * 4];
    const y = detecciones[i * 4 + 1];
    const ancho = detecciones[i * 4 + 2];
    const alto = detecciones[i * 4 + 3];

    // Calcula las coordenadas en el canvas
    const canvasX = x * canvas.width;
    const canvasY = y * canvas.height;
    const canvasAnchoObjeto = ancho * canvas.width;
    const canvasAltoObjeto = alto * canvas.height;

    // Dibuja el cuadro delimitador en el canvas
    contexto.strokeStyle = "red";
    contexto.lineWidth = 2;
    contexto.beginPath();
    contexto.rect(canvasX, canvasY, canvasAnchoObjeto, canvasAltoObjeto);
    contexto.stroke();
  }

  tensor.dispose(); // Liberar el tensor de la imagen
}
