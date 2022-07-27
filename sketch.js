const imagePath = '<PATH GOES HERE>';
let arial;
let mouseHandler;
let tierList;

function preload() {
    arial = loadFont('assets/arial.ttf');
}

const buffer = 100;//30;

function setup() {
    createCanvas(windowWidth - buffer, windowHeight);
    textFont(arial, 28);

    tierList = new TierList(TIER_MARGIN, TIER_MARGIN, width - 2*TIER_MARGIN, height - 2*TIER_MARGIN);
    mouseHandler = new MouseHandler(tierList);

    const images = ['elephant.png', 'snake.png', 'walrus.png', 'zebra.png'];
    images.forEach(path => loadImage(`assets/${path}`, img => tierList.addItemWithImage(img)));
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
    resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
    mouseHandler.handleMouseDragged(mouseX, mouseY);
}

function mouseReleased() {
    mouseHandler.handleMouseReleased(mouseX, mouseY);
}