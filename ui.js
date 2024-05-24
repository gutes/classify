let categoryNames = {}; // Store category names
let categoriesQuadrants = [];
let imagesInCanvas = {}; // Track which images are in the canvas

const stage = new createjs.Stage("demoCanvas");
const imageSets = {
    superheroes: [
        'https://via.placeholder.com/100?text=Superhero1',
        'https://via.placeholder.com/100?text=Superhero2',
        'https://via.placeholder.com/100?text=Superhero3',
        'https://via.placeholder.com/100?text=Superhero4',
        'https://via.placeholder.com/100?text=Superhero5',
        'https://via.placeholder.com/100?text=Superhero6',
        'https://via.placeholder.com/100?text=Superhero7',
        'https://via.placeholder.com/100?text=Superhero8',
        'https://via.placeholder.com/100?text=Superhero9'
    ],
    periodic_table_elements: [
        'https://via.placeholder.com/100?text=Element1',
        'https://via.placeholder.com/100?text=Element2',
        'https://via.placeholder.com/100?text=Element3',
        'https://via.placeholder.com/100?text=Element4',
        'https://via.placeholder.com/100?text=Element5',
        'https://via.placeholder.com/100?text=Element6',
        'https://via.placeholder.com/100?text=Element7',
        'https://via.placeholder.com/100?text=Element8',
        'https://via.placeholder.com/100?text=Element9'
    ],
    plants: [
        'https://via.placeholder.com/100?text=Plant1',
        'https://via.placeholder.com/100?text=Plant2',
        'https://via.placeholder.com/100?text=Plant3',
        'https://via.placeholder.com/100?text=Plant4',
        'https://via.placeholder.com/100?text=Plant5',
        'https://via.placeholder.com/100?text=Plant6',
        'https://via.placeholder.com/100?text=Plant7',
        'https://via.placeholder.com/100?text=Plant8',
        'https://via.placeholder.com/100?text=Plant9'
    ],
    vehicles: [
        'https://via.placeholder.com/100?text=Vehicle1',
        'https://via.placeholder.com/100?text=Vehicle2',
        'https://via.placeholder.com/100?text=Vehicle3',
        'https://via.placeholder.com/100?text=Vehicle4',
        'https://via.placeholder.com/100?text=Vehicle5',
        'https://via.placeholder.com/100?text=Vehicle6',
        'https://via.placeholder.com/100?text=Vehicle7',
        'https://via.placeholder.com/100?text=Vehicle8',
        'https://via.placeholder.com/100?text=Vehicle9'
    ]
};

// Enable drag and drop functionality with HTML5 Drag and Drop API and CreateJS
const canvas = document.getElementById('demoCanvas');
canvas.addEventListener('dragover', function (event) {
    event.preventDefault();
}, false);

canvas.addEventListener('drop', function (event) {
    event.preventDefault();
    const imgSrc = event.dataTransfer.getData('src');
    const existingImage = stage.children.find(child => child instanceof createjs.Bitmap && child.image.src === imgSrc);
    if (!existingImage) {
        addImageToCanvas(imgSrc, event.clientX, event.clientY);
    }
}, false);

// Initialize with default settings
updateQuadrants();
loadImageSet();

function drawQuadrants(numberOfQuadrants) {
    stage.clear();
    stage.removeAllChildren();
    const canvas = stage.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Define positions and sizes for the text
    let positions;
    categoriesQuadrants = [];
    if (numberOfQuadrants === 2) {
        drawRectangle(0, 0, width / 2, height);
        drawRectangle(width / 2, 0, width / 2, height);
        positions = [
            { x: width / 4, y: height / 2 , quadrantX: 0, quadrantY: 0, width: width / 2, height: height },
            { x: 3 * width / 4, y: height / 2, quadrantX: width / 2, quadrantY: 0, width: width / 2, height: height }
        ];
    } else if (numberOfQuadrants === 3) {
        drawRectangle(0, 0, width / 2, height / 2);
        drawRectangle(width / 2, 0, width / 2, height / 2);
        drawRectangle(0, height / 2, width, height / 2);
        positions = [
            { x: width / 4, y: height / 4 , quadrantX: 0, quadrantY: 0, width: width / 2, height: height / 2 },
            { x: 3 * width / 4, y: height / 4, quadrantX: width / 2, quadrantY: 0, width: width / 2, height: height / 2 },
            { x: width / 2, y: 3 * height / 4, quadrantX: 0, quadrantY: height / 2, width: width, height: height / 2  }
        ];
    } else if (numberOfQuadrants === 4) {
        drawRectangle(0, 0, width / 2, height / 2);
        drawRectangle(width / 2, 0, width / 2, height / 2);
        drawRectangle(0, height / 2, width / 2, height / 2);
        drawRectangle(width / 2, height / 2, width / 2, height / 2);
        positions = [
            { x: width / 4, y: height / 4, quadrantX: 0, quadrantY: 0, width: width / 2, height: height / 2 },
            { x: 3 * width / 4, y: height / 4, quadrantX: width / 2, quadrantY: 0, width: width / 2, height: height / 2 },
            { x: width / 4, y: 3 * height / 4, quadrantX: 0, quadrantY: height / 2, width: width / 2, height: height / 2 },
            { x: 3 * width / 4, y: 3 * height / 4, quadrantX: width / 2, quadrantY: height / 2, width: width / 2, height: height / 2 }
        ];
    } else if (numberOfQuadrants === 5) {
        drawRectangle(0, 0, width / 3, height / 2);
        drawRectangle(width / 3, 0, width / 3, height / 2);
        drawRectangle(2 * width / 3, 0, width / 3, height / 2);
        drawRectangle(0, height / 2, width / 3, height / 2);
        drawRectangle(width / 3, height / 2, 2 * width / 3, height / 2);
        positions = [
            { x: width / 6, y: height / 4, quadrantX: 0, quadrantY: 0, width: width / 3, height: height / 2 },
            { x: width / 2, y: height / 4, quadrantX: width / 3, quadrantY: 0, width: width / 3, height: height / 2 },
            { x: 5 * width / 6, y: height / 4, quadrantX: 2 * width / 3, quadrantY: 0, width: width / 3, height: height / 2 },
            { x: width / 6, y: 3 * height / 4, quadrantX: 0, quadrantY: height / 2, width: width / 3, height: height / 2 },
            { x: width / 2, y: 3 * height / 4, quadrantX: width / 3, quadrantY: height / 2, width: 2 * width / 3, height: height / 2 }
        ];
    } else if (numberOfQuadrants === 6) {
        drawRectangle(0, 0, width / 3, height / 2);
        drawRectangle(width / 3, 0, width / 3, height / 2);
        drawRectangle(2 * width / 3, 0, width / 3, height / 2);
        drawRectangle(0, height / 2, width / 3, height / 2);
        drawRectangle(width / 3, height / 2, width / 3, height / 2);
        drawRectangle(2 * width / 3, height / 2, width / 3, height / 2);
        positions = [
            { x: width / 6, y: height / 4, quadrantX: 0, quadrantY: 0, width: width / 3, height: height / 2 },
            { x: width / 2, y: height / 4, quadrantX: width / 3, quadrantY: 0, width: width / 3, height: height / 2 },
            { x: 5 * width / 6, y: height / 4, quadrantX: 2 * width / 3, quadrantY: 0, width: width / 3, height: height / 2 },
            { x: width / 6, y: 3 * height / 4, quadrantX: 0, quadrantY: height / 2, width: width / 3, height: height / 2 },
            { x: width / 2, y: 3 * height / 4, quadrantX: width / 3, quadrantY: height / 2, width: width / 3, height: height / 2 },
            { x: 5 * width / 6, y: 3 * height / 4, quadrantX: 2* width / 3, quadrantY: height / 2, width: width / 3, height: height / 2 }
        ];
    }
    let index = 0;
    /*positions.forEach(pos => {
        categoriesQuadrants.push({pos: pos, id : `categoria${index}` });
        index++;
    });*/
    
    positions.forEach(pos => {
        categoriesQuadrants.push({
            pos: {h: parseFloat(pos.x), y: parseFloat(pos.y)}, 
            id : `categoria${index}`,
            quadrant: {
                x: parseFloat(pos.quadrantX),
                y: parseFloat(pos.quadrantY),
                height: parseFloat(pos.height),
                width: parseFloat(pos.width)
            }
        });
        index++;
    });

    addCategoryNames(positions, numberOfQuadrants);
    stage.update();
}

function drawRectangle(x, y, width, height) {
    const rect = new createjs.Shape();
    rect.graphics.setStrokeStyle(1).beginStroke("black").drawRect(x, y, width, height);
    stage.addChild(rect);
}

function addCategoryNames(positions, numberOfQuadrants) {
    const categoryInputs = document.querySelectorAll('#categoryInputs input');
    categoryInputs.forEach((input) => {
        categoryNames[input.id] = input.value.trim() || `Categoría ${input.id.replace('categoria', '')}`;
    });
    
    let index = 0;
    positions.forEach((pos, index) => {
        const categoryName = categoryNames[`categoria${index + 1}`] || `Categoría ${index + 1}`;
        const text = new createjs.Text(categoryName, "20px Arial", "#000");
        text.x = pos.x;
        text.y = pos.y;
        text.textAlign = "center";
        text.textBaseline = "middle";
        categoriesQuadrants[index].name = categoryName;
        stage.addChild(text);
        index++;
    });

    stage.update();
}

function loadImageSet() {
    const setName = document.getElementById('imageSets').value;
    const set = imageSets[setName];
    const imageList = document.getElementById('imageList');
    imageList.innerHTML = '';
    imagesInCanvas = {}; // Reset the tracking object
    
    set.forEach(imagePath => {
        const imgElement = document.createElement('img');
        imgElement.src = imagePath;
        imgElement.draggable = true;
        imgElement.ondragstart = function (event) {
            event.dataTransfer.setData('src', imagePath);
        };
        imageList.appendChild(imgElement);
    });

    // Redraw quadrants to ensure category names are visible
    drawQuadrants(parseInt(document.getElementById('quadrants').value, 10));
}

function addImageToCanvas(imgSrc, x, y) {
    const offsetX = canvas.getBoundingClientRect().left;
    const offsetY = canvas.getBoundingClientRect().top;
    const image = new createjs.Bitmap(imgSrc);

    image.x = x - offsetX - 50; // adjusted to center the image on cursor
    image.y = y - offsetY - 50; // adjusted to center the image on cursor
    image.scaleX = 1; // Ensure size remains unchanged
    image.scaleY = 1; // Ensure size remains unchanged
    enableDragAndDrop(image);
    stage.addChild(image);
    stage.update();
    
    console.log(categoriesQuadrants);
    imagesInCanvas[imgSrc] = {x: image.x, y: image.y}; // Mark the image as added to the canvas
}

function enableDragAndDrop(target) {
    // Enable drag and drop within the canvas
    target.on("pressmove", function (event) {
        event.target.x = event.stageX;
        event.target.y = event.stageY;
        stage.update(); // Redraw the stage
    });

    target.on("mousedown", function (event) {
        const imageUrl = event.target.image.src;
        event.nativeEvent.dataTransfer.setData('src', imageUrl);
    }, false);
}

function saveResults() {
    const reasoning = document.getElementById('userReasoning').value;
    const categoryInputs = document.querySelectorAll('#categoryInputs input');
    categoryInputs.forEach(input => {
        categoryNames[input.id] = input.value.trim() || `Category ${input.id.replace('category', '')}`;
    });

    const imagePositions = stage.children.filter(child => child instanceof createjs.Bitmap).map(child => ({
        imageId: child.image ? child.image.src.split('/').pop() : null,
        x: child.x,
        y: child.y
    }));

    console.log(imagePositions);

    imagePositions.forEach(img => {
        let category = "";
        img.category = determineCategoryFromQuadrants(img.x, img.y);
        //console.log (`Image ${img.imageId} is at ${determineCategoryFromQuadrants(img.x, img.y)}`) 
    });

    console.log(imagePositions);
    
    const data = {
        reasoning,
        categoryNames: Object.values(categoryNames),
        imagePositions
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

function determineCategoryFromQuadrants(x, y){
    let category = null;
    let index = 0;

    categoriesQuadrants.forEach(catQ => {
        if ((x > catQ.quadrant.x) && (x < catQ.quadrant.x + catQ.quadrant.width) &&
            (y > catQ.quadrant.y) && (y < catQ.quadrant.y + catQ.quadrant.height)){
                category = catQ.name
            }
        index++;
    });
    return category;
}

function updateQuadrants() {
    const numberOfQuadrants = parseInt(document.getElementById('quadrants').value, 10);
    updateCategoryInputs(numberOfQuadrants);
    drawQuadrants(numberOfQuadrants);
}

function updateCategoryInputs(numberOfQuadrants) {
    const categoryInputsDiv = document.getElementById('categoryInputs');
    categoryInputsDiv.innerHTML = '';
    for (let i = 1; i <= numberOfQuadrants; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nombre Categoría ${i}`;
        input.id = `categoria${i}`;
        input.value = categoryNames[input.id] || `Categoría ${i}`;  // Preserve existing names or use default
        input.addEventListener('blur', (event) => {
            categoryNames[event.target.id] = event.target.value.trim() || `Categoría ${i}`;
            drawQuadrants(numberOfQuadrants); // Update category names on focus out
        });
        categoryInputsDiv.appendChild(input);
        categoryInputsDiv.appendChild(document.createElement('br'));
    }
}

