const imagePath = '<PATH GOES HERE>';
let arial;
let mouseHandler;
let tierList;

function preload() {
    arial = loadFont('assets/arial.ttf');
}

const buffer = 100;

function setup() {
    createCanvas(windowWidth - buffer, windowHeight).parent("sketch-holder");
    textFont(arial, 28);

    tierList = new TierList(TIER_MARGIN, TIER_MARGIN, width - 2*TIER_MARGIN, height - 2*TIER_MARGIN);
    mouseHandler = new MouseHandler(tierList);

    //const images = ['elephant.png', 'snake.png', 'walrus.png', 'zebra.png'];
    //images.forEach(path => loadImage(`assets/${path}`, img => tierList.addItemWithImage(img)));
}

function draw() {
    mouseHandler.handleMouseMoved(mouseX, mouseY);

    const newHeight = tierList.height + 2*TIER_MARGIN;
    if (newHeight !== height) resizeCanvas(width, newHeight);

    background(200);
    tierList.draw();
    mouseHandler.draw();
}

function windowResized() {
    //resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
    mouseHandler.handleMouseDragged(mouseX, mouseY);
}

function mouseReleased() {
    mouseHandler.handleMouseReleased(mouseX, mouseY);
}

// --- Button event listeners --- 

function onAddImageButtonClick(e) {
    const input = document.getElementById('image-input');
    const urls = input.value.split(',');
    urls.forEach(url => {
        loadImage(url.trim(), img => tierList.addItemWithImage(img));
    });
    input.value = '';
}

function onDownloadButtonClick(e) {
    saveCanvas('tier-list');
}

function onUploadFiles(e) {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;
    //console.log(files);

    files.forEach(file => {
        const objectURL = window.URL.createObjectURL(file);
        //console.log(objectURL);
        loadImage(objectURL, img => tierList.addItemWithImage(img));
    });

    fileInput.value = null;
}

document.getElementById('download-button').addEventListener('click', onDownloadButtonClick);
document.getElementById('add-image-button').addEventListener('click', onAddImageButtonClick);
document.getElementById('file-input').addEventListener('change', onUploadFiles);