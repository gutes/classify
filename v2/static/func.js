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
        saveStageState();
    });

    // Agregar la imagen al escenario
    contenedor.addChild(bitmap);
    stage.update();
}

// Función para guardar un frame con el estado actual del stage
function saveStageState(){
    let current_state = [];

    for (let key in current_on_stage){
        current_state.push({'name' : current_on_stage[key].image.id.split("/")[1], 
                            'x'  : current_on_stage[key].x, 
                            'y'  : current_on_stage[key].y});
    };
    
    frame = {'timestamp': Math.floor(Date.now() / 1000),
            'stage_state' : current_state
        };
    timeline = JSON.parse(localStorage.getItem('timeline'));
    timeline.push(frame);
    localStorage.setItem('timeline', JSON.stringify(timeline));
}

// Función para nombrar los grupos
function nameGroups(){
    var i = 0;
    
    // Borro los grupos por si cambiaron
    current_groups = {};

    document.getElementById("grupos").innerHTML = "";

    // itero las componentes conexas, ordenadas de mayor a menor
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

// Validación stage
function validateStage(){
    // Todas las imagenes en el escenario y no puede haber una imagen en cada grupo

    let remaing_images = imagenes.length - Object.keys(current_on_stage).length;
    if ((remaing_images > 0) || (groups_on_stage == imagenes.length)){
        return false;
    }
    return true;
}

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
    timeline = JSON.stringify(localStorage.getItem("timeline")); 

    const data = {
        "user_name" : user_name,
        "reasoning": reasoning,
        "current_groups": current_groups_list,
        "timeline" : timeline
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

