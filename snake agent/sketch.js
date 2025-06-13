var s;
var scl = 20;

function setup() {
    createCanvas(600, 600);
    frameRate(10);

    s = new Snake();
    generateFoodLocation();
}

function draw() {
    background(51);

    if (s.eat(food)) {
        generateFoodLocation();
    }

    s.think();
    s.death();
    s.update();
    s.show();

    fill(255, 0, 100);
    rect(food.x, food.y, scl, scl);
}
