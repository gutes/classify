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
fondo.graphics.beginFill("#AAAAAA66").drawRect(0, canvas.height-120, canvas.width, canvas.height);
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

// Lista de experimentos/imágenes - en orden aleatorio
const urlParams = new URLSearchParams(window.location.search);

try {
    var experiment_ids = shuffleArray(atob(urlParams.get("exp")).split("|")); // get base64 encoded experiments (2) and shuffle it
}catch (error){
    console.error("ERROR: Experiment Key erronea");
    stop();
}


var experiments = { '1' : { "exp_name" : "Superheroes",
                            "exp_images": [ "s01-t.png", "s02-t.png", "s03-t.png", "s04-t.png", "s05-t.png", "s06-t.png", "s07-t.png", "s08-t.png", "s09-t.png"]
                        },
                    '2' : { "exp_name": "Tabla Periódica",
                            "exp_images": [ "p01-t.png", "p02-t.png", "p03-t.png", "p04-t.png", "p05-t.png", "p06-t.png", "p07-t.png", "p08-t.png", "p09-t.png"]
                    }
};

var imagenes = []; //las imagenes para ESTA CORRIDA del experimento
var experiment_name = "";

// Tomamos el siguiente experimento del array mezclado y lo mostramos. Reentra cuando termina solo con el experimento que sigue
if (experiment_ids.length > 0) {
    var current_experiment = experiment_ids.pop();

    // Validamos que el experimento sea valido y no basura
    if (current_experiment in experiments){
        imagenes = experiments[current_experiment].exp_images;
        experiment_name = experiments[current_experiment].exp_name;
        document.getElementById("experiment_name").innerHTML = experiment_name;
        document.getElementById("experiment_name2").innerHTML = experiment_name;
        shuffleArray(imagenes);

        var grafo = new Grafo(imagenes.length);
        var positions = [[90-50, 550], [180-50,550], [270-50, 550], [360-50, 550], [450-50, 550], [540-50,550], [630-50, 550], [720-50, 550], [800-50, 550]];

        // Llamar a la función para cargar las imágenes
        cargarImagenes();
        updateText();
        
        // Si el usuario ya esta haciendo experimentos entonces relleno sus datos
        if (isAWorkingUser()){
            fillWorkingUserData(); // Relleno los datos del usuario actual
            if (experiment_ids.length == 0){
                deleteWorkingUser(); // Ultimo experimento, borro el current_user
            }
        }
        
        // Actualizar el escenario en cada "tick"
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        
        /* Event handlers para los botones */
        // Botón Comenzar
        document.getElementById("introBtn").addEventListener("click", function () {
            // Validar que haya ingresado sus datos personales
            if (validatePersonalData()){
                if (!isAWorkingUser() && (experiment_ids.length > 0) ){
                    storeWorkingUser(); // Guardo los datos del usuario actual
                }

                document.querySelector(".contenedor").style.transform = "translateX(-16.66%)"; // Desplazar a la izquierda
                document.getElementById("ErrAllData").style.visibility = "hidden";
            }else{
                document.getElementById("ErrAllData").style.visibility = "visible";
            }
        });

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
            document.querySelector(".contenedor").style.transform = "translateX(-33.33%)"; // Desplazar a la izquierda
        });

        // Botón seguir - nombrar categorias
        document.getElementById("seguirBtn").addEventListener("click", function () {
            if (validateStage()){
                nameGroups();
                document.querySelector(".contenedor").style.transform = "translateX(-50%)"; // Desplazar a la izquierda
                document.getElementById("ErrAllImgs").style.visibility = "hidden";
            }else{
                document.getElementById("ErrAllImgs").style.visibility = "visible";
            }
        });

        // Botón volver
        document.getElementById("volverBtn").addEventListener("click", function () {
            document.querySelector(".contenedor").style.transform = "translateX(-16.66%)"; // Desplazar a la derecha
        });

        // Botón volver al canvas
        document.getElementById("volverCanvasBtn").addEventListener("click", function () {
            document.querySelector(".contenedor").style.transform = "translateX(-33.33%)"; // Desplazar a la derecha
        });

        // Botón finalizar y preguntar nivel de expertise
        document.getElementById("seguirBtn-2").addEventListener("click", function () {
            if (validateGroupNames()){
                document.querySelector(".contenedor").style.transform = "translateX(-66.66%)"; // Desplazar a la derecha
                document.getElementById("ErrGroupNames").style.visibility = "hidden";
            }else{
                document.getElementById("ErrGroupNames").style.visibility = "visible";
            }
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

        // Botón Guardar y Terminar
        document.getElementById("saveBtn").addEventListener("click", function () {
            // termina el experimento en curso. Siguiente pagina con un experimento menos. Los siguientes experimentos van concatenados por '|' y todo encodeado en base64. 
            saveResults();
            window.location.replace(window.location.href.split('?')[0]+ "?exp=" + btoa(experiment_ids.join("|")));    
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
    }else{
        // Experimento no válido ---> Pagina final // Error en el encoding de experimentos (i.e. mandó fruta. Silent fail)
        console.error("Experimento no válido");
        document.querySelector(".contenedor").style.transform = "translateX(-83.33%)"
    }
}else{
    // fin de los experimentos ---> Pagina final
    console.log("Fin de los experimentos");
    deleteWorkingUser(); // Ultimo experimento, borro el current_user
    document.querySelector(".contenedor").style.transform = "translateX(-83.33%)"
}