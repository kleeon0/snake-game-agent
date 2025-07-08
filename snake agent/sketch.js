let snakes = [];
let history = [];
let scl = 20;
const MAX_SNAKES = 300;
let total_snakes = MAX_SNAKES;
const width = 800;
const height = 600;

class Board {
    constructor(x, y, w, h, scl, numSnakes) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.scl = scl;
        this.snakes = [];
        this.history = [];
        this.total_snakes = numSnakes;
        this.food_pos = this.generateFoodLocation();

        for (let i = 0; i < numSnakes; i++) {
            let sx = floor(random(0, w / scl)) * scl + x;
            let sy = floor(random(0, h / scl)) * scl + y;
            this.snakes.push(new Snake(sx, sy, this.food_pos));
        }
    }

    generateFoodLocation() {
        let fx = floor(random(0, this.w / this.scl)) * this.scl + this.x;
        let fy = floor(random(0, this.h / this.scl)) * this.scl + this.y;
        return createVector(fx, fy);
    }

    drawGrid() {
        stroke(255);
        for (let i = this.x; i <= this.x + this.w; i += this.scl) {
            line(i, this.y, i, this.y + this.h);
        }
        for (let j = this.y; j <= this.y + this.h; j += this.scl) {
            line(this.x, j, this.x + this.w, j);
        }
    }

    update() {
        for (let s of this.snakes) {
            s.think();
            s.update();
            s.show();
            s.drawFood();
            s.updateScore();

            if (s.eat()) {
                this.food_pos = this.generateFoodLocation();
            }

            for (let j = 0; j < this.total_snakes; j++) {
                if (this.snakes[j].detectDeath(this.w, this.h)) {
                    this.history.push(this.snakes[j]);
                    this.snakes.splice(j, 1);
                    this.total_snakes--;
                }
            }

            if (frameCount >= 300) {
                this.history.push(this.snakes[0]);
                this.snakes.splice(0, 1);
                this.total_snakes--;
            }
        }

        if (this.snakes.length == 0) {
            frameCount = 0;
            this.nextGeneration();
        }
    }

    nextGeneration() {
        // Implement your nextGeneration logic here
    }
}

function setup() {
    createCanvas(width, height);
    // Center the canvas on the page
    let canvas = createCanvas(width, height);
    canvas.parent(document.body);
    canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
    frameRate(1000);

    // Create 10 boards in a 5x2 grid starting from (0, 0), placed next to each other
    let boards = [];
    let boardsPerRow = 5;
    let numRows = 2;
    let numBoards = boardsPerRow * numRows;
    let snakesPerBoard = 1;

    // Ensure board sizes and positions are multiples of scl to avoid overlap
    let boardWidth = Math.floor((width / boardsPerRow) / scl) * scl;
    let boardHeight = Math.floor((height / numRows) / scl) * scl;

    for (let i = 0; i < numBoards; i++) {
        let row = Math.floor(i / boardsPerRow);
        let col = i % boardsPerRow;
        let bx = col * boardWidth;
        let by = row * boardHeight;
        boards.push(new Board(bx, by, boardWidth, boardHeight, scl, snakesPerBoard));
    }

    window.boards = boards; // Make boards accessible in draw()

    // Draw grid lines
    stroke(255); // Set stroke color to white
    for (let i = 0; i <= width; i += scl) {
        line(i, 0, i, height);
    }
    for (let j = 0; j <= height; j += scl) {
        line(0, j, width, j);
    }

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

    // Update and draw all boards
    for (let board of window.boards) {
        board.drawGrid();
        board.update();
    }
}
