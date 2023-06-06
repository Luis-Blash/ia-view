const fs = require("fs");

// Definir los objetos anotados
const objetosAnotados = [
  {
    image: "dogone.jpg",
    label: "dog",
    objects: [
      {
        class: "dogone",
        bbox: [100, 200, 50, 80],
      },
    ],
  },
];

// Crear un objeto que contenga los objetos anotados
const anotaciones = {
  objects: objetosAnotados,
};

// Convertir el objeto de anotaciones a formato JSON
const anotacionesJSON = JSON.stringify(anotaciones, null, 2);

// Escribir el contenido en un archivo
fs.writeFileSync("./annotations/anotacion1.json", anotacionesJSON);

console.log("El archivo de anotación se ha creado exitosamente.");
