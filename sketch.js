const imagePath = '<PATH GOES HERE>';
let arial;
let mouseHandler;
let tierList;

function preload() {
    arial = loadFont('assets/arial.ttf');

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont(arial, 36);

    tierList = new TierList(TIER_MARGIN, TIER_MARGIN, width - 2*TIER_MARGIN, height - 2*TIER_MARGIN);
    mouseHandler = new MouseHandler(tierList);
}

function draw() {
    mouseHandler.handleMouseMoved(mouseX, mouseY);

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