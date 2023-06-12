var modelo = null;

//Cargar modelo
(async () => {
  console.log("Cargando modelo...");
  modelo = await tf.loadLayersModel("model.json");
  console.log("Modelo cargado...");
})();

function cambiarCelsius() {
  var celsius = document.getElementById("celsius").value;
  document.getElementById("lbl-celsius").innerHTML = celsius;
  if (modelo != null) {
    var tensor = tf.tensor1d([parseInt(celsius)]);
    var prediccion = modelo.predict(tensor).dataSync();
    prediccion = Math.round(prediccion, 1);
    document.getElementById("resultado").innerHTML =
      celsius + " celsius son " + prediccion + " fahrenheit!";
  } else {
    document.getElementById("resultado").innerHTML =
      "Intenta de nuevo en un momento...";
  }
}
