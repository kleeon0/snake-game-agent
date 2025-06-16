function nextGeneration() {
    total_snakes = MAX_SNAKES;

    calculateFitness();

    let x = floor(random(0, width / scl)) * scl;
    let y = floor(random(0, height / scl)) * scl;
    let food_pos = generateFoodLocation();

    for (let i = 0; i < total_snakes; i++) {
        snakes.push(pickSnake(x, y, food_pos));
    }

    history = [];
}

function pickSnake(x, y, food_pos) {
    var index = 0;
    var r = random(1);

    while (r > 0) {
        r = r - history[index].fitness;
        index++;
    }
    index--;

    let snake = history[index];

    child = new Snake(x, y, food_pos, snake.brain);
    child.mutate(0.1);

    return child;
}

function calculateFitness() {
    let sum = 0;

    for (let snake of history) {
        sum += snake.score;
    }

    for (let snake of history) {
        snake.fitness = snake.score / sum;
    }
}