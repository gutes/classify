var text = new createjs.Text();

var colors_palette = ["#999999", "#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"]
var current_groups = {};
var current_elems = {};
var current_on_stage = {};

// Crear el escenario (stage) y el lienzo (canvas)
var canvas = document.getElementById("lienzo");
var stage = new createjs.Stage(canvas);
createjs.Touch.enable(stage);

// Agregar un fondo blanco al lienzo
var fondo = new createjs.Shape();
fondo.graphics.beginFill("#AAAAAA66")
        .drawRect(0, canvas.height-120, canvas.width, canvas.height);
stage.addChild(fondo);

// Crear un contenedor para las imágenes
var contenedor = new createjs.Container();
stage.addChild(contenedor);

var textContChar = new createjs.Text();
var textContGroups = new createjs.Text();
stage.addChild(textContChar);
stage.addChild(textContGroups);

var timeline = [];
localStorage.setItem('timeline', JSON.stringify(timeline));

// Lista de imágenes - en orden aleatorio
var imagenes = [ "img/s01-t.png", "img/s02-t.png", "img/s03-t.png", "img/s04-t.png", "img/s05-t.png", "img/s06-t.png", "img/s07-t.png", "img/s08-t.png", "img/s09-t.png"];
imagenes.sort(() => Math.random() - 0.5);
var grafo = new Grafo(imagenes.length)

var positions = [[90-50, 550], [180-50,550], [270-50, 550],
             [360-50, 550], [450-50, 550],
            [540-50,550], [630-50, 550], [720-50, 550], [800-50, 550],
             ];

// Llamar a la función para cargar las imágenes
cargarImagenes();
updateText();

// Actualizar el escenario
createjs.Ticker.addEventListener("tick", function () {
    stage.update();
});

/* Event handlers para los botones */
// Botón Comenzar
document.getElementById("comenzarBtn").addEventListener("click", function () {
    // Obtener el nombre ingresado por el usuario
    let nombre = document.getElementById("nombre").value;

    text.text = "Clasificación de " + nombre
    text.font = "12px Arial"
    text.color = "#000000";
    text.x = canvas.width - 10;
    text.y = canvas.height - 10;
    text.textAlign = "right";
    text.textBaseline = "alphabetic";
    stage.addChild(text);
    // Desplazar a la segunda página
    document.querySelector(".contenedor").style.transform = "translateX(-33%)"; // Desplazar a la izquierda
});

// Botón seguir - nombrar categorias
document.getElementById("seguirBtn").addEventListener("click", function () {
    if (validateStage()){
        nameGroups();
        document.querySelector(".contenedor").style.transform = "translateX(-66%)"; // Desplazar a la izquierda
        document.getElementById("ErrAllImgs").style.visibility = "hidden";
    }else{
        document.getElementById("ErrAllImgs").style.visibility = "visible";
    }
});

// Botón volver
document.getElementById("volverBtn").addEventListener("click", function () {
    document.querySelector(".contenedor").style.transform = "translateX(0)"; // Desplazar a la derecha
});

// Botón volver al canvas
document.getElementById("volverCanvasBtn").addEventListener("click", function () {
    document.querySelector(".contenedor").style.transform = "translateX(-33%)"; // Desplazar a la derecha
});


// Botón de reinicio
document.getElementById("reiniciarBtn").addEventListener("click", function () {
    // Obtener el nombre ingresado por el usuario
    for (let key in current_elems) {
        bitmap = current_elems[key];
        set_initial_positions(bitmap, key);
        bitmap.shadow = null;
        bitmap.group = key
    }
    current_on_stage = {};
    grafo.reset();
    updateText()
});

// Botón Guardar
document.getElementById("saveBtn").addEventListener("click", function () {
    saveResults();
    
});

// Botón de descarga
document.getElementById("descargarBtn").addEventListener("click", function () {
    accentsTidy = function(s){
        let r = s.toLowerCase();
        non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
        for (i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
        return r;
    };

    // Convertir el contenido del lienzo a una imagen PNG
    let dataURL = canvas.toDataURL("image/png");

    let nombre = ""; //document.getElementById("nombre").value;

    nombre = accentsTidy(nombre);
    nombre = nombre.replace(/ /g, "_");

    // Crear un enlace temporal para descargar la imagen
    var enlace = document.createElement("a");
    enlace.href = dataURL;
    enlace.download = "grupos_" + nombre +".png";

    // Simular un clic en el enlace para iniciar la descarga
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
});