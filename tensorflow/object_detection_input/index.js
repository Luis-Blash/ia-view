const inputFile = document.getElementById("inputFile");
const outputCanvas = document.getElementById("outputCanvas");
const ctx = outputCanvas.getContext("2d");
let model;

// Cargar el modelo Coco-SSD
cocoSsd.load().then((loadedModel) => {
  console.log('model');
  model = loadedModel;
});

// Escuchar el evento 'change' del input de archivo
inputFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const img = new Image();

    img.onload = async function () {
      // Realizar la detección de objetos en la imagen
      const predictions = await model.detect(img);

      // Dibujar la imagen en el lienzo
      outputCanvas.width = img.width;
      outputCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Recorrer las predicciones y dibujar los bboxes
      predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        const className = prediction.class;

        // Dibujar el bbox en el lienzo
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        ctx.stroke();
        ctx.fillText(className, x, y - 5);
      });
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});
