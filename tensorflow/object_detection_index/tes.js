const video = document.getElementById("webcam");
const liveView = document.getElementById("liveView");
const demosSection = document.getElementById("demos");
const enableWebcamButton = document.getElementById("webcamButton");

// Check if webcam access is supported.
function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will
// define in the next step.
if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start classification.
function enableCam(event) {
  console.log('activa');
  console.log(model);
  // Only continue if the COCO-SSD has finished loading.
  if (!model) {
    return;
  }

  // Hide the button once clicked.
  event.target.classList.add("removed");

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}


var children = [];
// Placeholder function for next step.
function predictWebcam() {
  model.detect(video).then(function (predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    
    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        //* se agrega a la esecena de viewer
        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        //* agrega los hijos para ver que remueve
        children.push(highlighter);
        children.push(p);
      }
    }
    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}

// Pretend model has loaded so we can try out the webcam code.
// var model = true
// demosSection.classList.remove('invisible');

var model = undefined;
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  const nuevasImagenes = ['./data/dogone.jpg'];
  const nuevasAnotaciones = ['./data/annotations/anotacion1.json'];
  for (let i = 0; i < nuevasImagenes.length; i++) {
    let anotacion = null
    fetch(nuevasAnotaciones[i])
    .then(response => response.text())
    .then(contenido => {
      const imagen = nuevasImagenes[i];
      anotacion = JSON.parse(contenido)
      const img = new Image();
      imag.src = imagen;
      img.onload = function() {
        // La imagen se ha cargado correctamente
        console.log('La imagen se ha cargado correctamente.');
        model.detect(img).then(predictions => {
          // Recorrer las predicciones y las anotaciones
          for (let j = 0; j < predictions.length; j++) {
            const pred = predictions[j];
            console.log(pred);
            const clasePrediccion = pred.class;
            const cajaPrediccion = pred.bbox;
    
            // Asignar la etiqueta y la caja delimitadora de la anotación correspondiente
            console.log(anotacion.objects[0], clasePrediccion);
            const anotacionObjeto = anotacion.objects.find(obj => obj.label === clasePrediccion);
            if (anotacionObjeto) {
              anotacionObjeto.bbox = cajaPrediccion;
            }
          }
    
          // Guardar la anotación actualizada en un nuevo archivo
          const nuevaAnotacion = JSON.stringify(anotacion);
          console.log(nuevaAnotacion);
          // fs.writeFileSync('ruta/nueva_anotacion.json', nuevaAnotacion);
        });
      };
    })
    .catch(error => {
      console.error('Error al cargar el archivo:', error);
    });
  }
  // Show demo section now model is ready to use.
  demosSection.classList.remove('invisible');
});
