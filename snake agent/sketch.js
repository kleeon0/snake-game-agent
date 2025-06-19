let snakes = [];
let history = [];
let scl = 20;
const MAX_SNAKES = 300;
let total_snakes = MAX_SNAKES;
const width = 400;
const height = 400;

function setup() {
    createCanvas(width, height);
    frameRate(1000);

    let x = floor(random(0, width / scl)) * scl;
    let y = floor(random(0, height / scl)) * scl;
    let food_pos = generateFoodLocation();

    for (let i = 0; i < total_snakes; i++) {
        snakes.push(new Snake(x, y, food_pos));
    }

    generateFoodLocation();
}

function draw() {
    background(51);

    for (let s of snakes) {
        s.think();
        s.update();
        s.show();
        s.drawFood();
        s.updateScore();

        if (s.eat()) {
            generateFoodLocation();
        }

        for (let j = 0; j < total_snakes; j++) {
            if (snakes[j].detectDeath()) {
                history.push(snakes[j])
                snakes.splice(j, 1);
                total_snakes--;
            }
        }

        if (frameCount >= 1000) {
            history.push(snakes[0])
            snakes.splice(0, 1);
            total_snakes--;
        }
    }

    if (snakes.length == 0) {
        frameCount = 0;
        nextGeneration();
    }
}
