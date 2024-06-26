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
    nameGroups();
    document.querySelector(".contenedor").style.transform = "translateX(-66%)"; // Desplazar a la izquierda
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

function updateText(){
    ids_on_stage = Object.keys(current_on_stage).map(function(x) { return parseInt(x); });
    groups_on_stage = grafo.getConnectedComponentsNumber(ids_on_stage)

    remaing_images = imagenes.length - Object.keys(current_on_stage).length;
    if (groups_on_stage > 0) {
        if (groups_on_stage == 1){
            textContGroups.text = "Hay " + groups_on_stage + " solo grupo";
            textContGroups.color = "#FF0000";
        } else {
            if (groups_on_stage == imagenes.length){
                textContGroups.text = "Hay " + groups_on_stage + " grupos formados";
                textContGroups.color = "#FF0000";
            } else {
                textContGroups.text = "Hay " + groups_on_stage + " grupos formados";
                textContGroups.color = "#000000";
            }
        }
    } else {
        textContGroups.text = "No hay grupos formados aun";
        textContGroups.color = "#FF0000";
    }
    textContGroups.font = "14px Arial"
    textContGroups.x = canvas.width - 10;
    textContGroups.y = 15;
    textContGroups.textAlign = "right";
    textContGroups.textBaseline = "alphabetic";

    if (remaing_images == 0){
        textContChar.text = ""
        textContChar.color = "#000000";
    } else {
        if (remaing_images > 1){
            textContChar.text = "Faltan " + remaing_images + " elementos"
        } else {
            textContChar.text = "Falta " + remaing_images + " elemento"
        }
        textContChar.color = "#FF0000";
    }

    textContChar.font = "14px Arial"
    textContChar.x = canvas.width - 10;
    textContChar.y = 30;
    textContChar.textAlign = "right";
    textContChar.textBaseline = "alphabetic";
}

function selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},100%,50%)`;
}

function get_near_images(bitmap) {
    threshold = 110;
    near_images = [];
    for (let key in current_on_stage) {
        if (current_on_stage[key].image.src == bitmap.image.src) {
            continue;
        }
        let other_bitmap = current_on_stage[key];
        let distance = Math.sqrt(Math.pow(bitmap.x - other_bitmap.x, 2) + Math.pow(bitmap.y - other_bitmap.y, 2));
        if (distance < threshold) {
            near_images.push(other_bitmap);
        }
    }

    return near_images;
}

function updateShadows(){
    grafo.getConnectedComponents().forEach(group => {
            let minValue = Math.min.apply(Math, group);
            let col_shadow = selectColor(minValue); //colors_palette[minValue%colors_palette.length];
            group.forEach(elem => {
                if (elem in current_on_stage){
                    current_elems[elem].shadow = new createjs.Shadow(col_shadow, 0, 0, 40);
                } else {
                    current_elems[elem].shadow = null;
                }
            });
    });
    updateText();

}

// Función para cargar las imágenes
function cargarImagenes() {
    for (let i = 0; i < imagenes.length; i++) {
        let imagen = new Image();
        imagen.src = imagenes[i];
        imagen.id = imagenes[i]; // Este id va a la DB - filename 


        imagen.index = i;
        imagen.onload = handleImageLoad;
    }
}

function set_initial_positions(bitmap, index){
    bitmap.x = positions[index][0];
    bitmap.y = positions[index][1];
}

// Función para manejar la carga de imágenes
function handleImageLoad(event) {
    var image = event.target;
    var bitmap = new createjs.Bitmap(image);

    current_elems[image.index] = bitmap;

    bitmap.id = image.id;
    bitmap.index = event.index;
    bitmap.group = image.index;

    // Ajustar el tamaño de la imagen a 80x80 píxeles
    bitmap.scaleX = bitmap.scaleY = 120 / bitmap.getBounds().width;

    // Ajustar el punto de registro al centro de la imagen
    bitmap.regX = bitmap.getBounds().width / 2;
    bitmap.regY = bitmap.getBounds().height / 2;

    // Obtener el tamaño escalado de la imagen
    var anchoEscalado = bitmap.getBounds().width;
    var altoEscalado = bitmap.getBounds().height;

    set_initial_positions(bitmap, image.index);

    // Configurar interactividad para arrastrar y soltar
    bitmap.on("pressmove", function (evt) {
        evt.currentTarget.x = evt.stageX;// - (bitmap.regX * bitmap.scaleX);
        evt.currentTarget.y = evt.stageY; // - (bitmap.regY * bitmap.scaleY);

        // Mover el objeto al frente de los demás
        contenedor.addChild(evt.currentTarget);
        stage.update();
    });


    bitmap.on("pressup", function (evt) {
        var currentBitmap = evt.currentTarget;
        grafo.removeEdgesOfNode(currentBitmap.image.index);

        if (evt.stageY < canvas.height-120){
            get_near_images(currentBitmap).forEach(function (elem) {
                grafo.addEdge(currentBitmap.image.index, elem.image.index);
            });

            current_on_stage[evt.currentTarget.image.index] = currentBitmap;
        } else {
            delete current_on_stage[evt.currentTarget.image.index];
        }
        updateShadows();
    });

    // Agregar la imagen al escenario
    contenedor.addChild(bitmap);
    stage.update();
}

function nameGroups(){
    var i = 0;
    
    // Borro los grupos por si cambiaron
    current_groups = {};

    document.getElementById("grupos").innerHTML = "";

    grafo.getConnectedComponents().sort((a, b) => b.length-a.length).forEach(group => {
            let groupDiv = document.createElement("div");
            groupDiv.style.border = "1px solid black";
            groupDiv.style.margin = "5px";
            groupDiv.style.height = "auto";
            groupDiv.style.display= "block";

            current_groups[`grupo${i}`] = {group_name : "", images : []}; 
        
            group.forEach(elem => {
                let imagen = new Image();
                imagen.src = current_elems[elem].id;
                imagen.style.display = "inline";
                imagen.style.margin = "5px";
                imagen.style.height = "150px";
                groupDiv.appendChild(imagen);
                current_groups[`grupo${i}`].images.push({ name : current_elems[elem].id.split("/")[1]});
            });

            // Agregar input para el nombre
            let nombre = document.createElement("input");
            nombre.type = "text";
            nombre.id = nombre.name = `grupo${i}`;
            nombre.placeholder = `Nombre Grupo ${i}`;
            nombre.style.display = "block";
            nombre.style.clear = "right";
            nombre.style.marginBottom = "20px";

            
            groupDiv.appendChild(nombre);
            document.getElementById("grupos").appendChild(groupDiv);
            i++;

    });
}

function saveResults() { 

    let current_groups_list = []
    let i = 0;
    
    for (group in current_groups){
        let gname = document.getElementById(`grupo${i}`).value;
        current_groups[`grupo${i}`].group_name = gname;
        current_groups_list.push({  "group_name" : gname, "images": current_groups[`grupo${i}`].images})
        i++;
    };
    
    reasoning = document.getElementById("reasoning").value;
    user_name = document.getElementById("nombre").value;

    const data = {
        "user_name" : user_name,
        "reasoning": reasoning,
        "current_groups": current_groups_list,
    };

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            alert('Results saved successfully!');
        }).catch(error => {
            console.error('Error saving results:', error);
            alert('Failed to save results.');
        });
}

 

