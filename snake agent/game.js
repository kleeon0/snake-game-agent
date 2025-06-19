function generateFoodLocation() {
    var cols = floor(width / scl);
    var rows = floor(height / scl);
    return createVector(floor(random(cols)), floor(random(rows))).mult(scl);
}

// function keyPressed() {
//     if (keyCode === UP_ARROW) {
//         s.up()
//     } else if (keyCode === DOWN_ARROW) {
//         s.down();
//     } else if (keyCode === RIGHT_ARROW) {
//         s.right();
//     } else if (keyCode === LEFT_ARROW) {
//         s.left();
//     }
// }

class Snake {
    constructor(x, y, food_pos, brain) {
        this.food = food_pos;
        this.x = x;
        this.y = y;
        this.xspeed = 1;
        this.yspeed = 0;
        this.total = 0;
        this.tail = [];
        this.score = 0;
        this.fitness = 0;

        if (brain) {
            this.brain = brain.copy();
        } else {
            // input nodes:
            //      head_x, head_y, tail_x, tail_y, x_speed, y_speed, total, food_x, food_y
            // hidden nodes:
            //      16 nodes in a single layer (constrained by the neural network configuration we're using)
            // output nodes:
            //      up, down, left, right
            this.brain = new NeuralNetwork(9, 16, 4);
        }
    }

    think() {
        // Formatting the input to give to the neural network
        let inputs = [
            this.x, this.y,
            this.tail.length > 0 ? this.tail[0].x : this.x, this.tail.length > 0 ? this.tail[0].y : this.y,
            this.xspeed, this.yspeed,
            this.total,
            this.food.x, this.food.y
        ];

        // Getting the neural networks's output layer
        let output = this.brain.predict(inputs);

        // Finding the maximum value to use that as the input
        let max_val_pos = 0;
        let max_val = 0;
        for (let i = 0; i < output.length; i++) {
            if (output[i] > max_val) {
                max_val_pos = i;
                max_val = output[i];
            }
        }

        if (max_val_pos == 0) {
            this.up();
        } else if (max_val_pos == 1) {
            this.down();
        } else if (max_val_pos == 2) {
            this.left();
        } else {
            this.right();
        }
    }

    mutate(val) {
        this.brain.mutate(val);
    }

    updateScore() {
        // If the snake eats the food
        if (this.eat()) {
            this.score += 1000;
        }

        // If the snake is closer to the food
        // let distance = abs(dist(this.x, this.y, this.food.x, this.food.y));
        // // map(value, range_1_min, range_1_max, range_2_min, range_2_max)
        // // returns the resultant value that the input value would be mapped to
        // this.score += map(constrain(distance, 0, 42), 0, 42, 50, -50);

        // If the snake is moving towards the food
        if (this.movingTowards()) {
            this.score++;
        }

        // If the snake is alive
        this.score -= frameCount / 100;
    }

    update() {
        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1];
            }
        }

        this.tail[this.total - 1] = createVector(this.x, this.y);
        this.x = this.x + this.xspeed * scl;
        this.y = this.y + this.yspeed * scl;
    }

    eat() {
        var d = dist(this.x, this.y, this.food.x, this.food.y);

        if (d < 1) {
            this.total++;
            return true;
        }
        else {
            return false;
        }
    }

    detectDeath() {
        // Check if it collides with it's tail
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1) {
                return true;
            }
        }

        // Check if it collides with a wall
        if (this.x < 0 || this.x > width - scl || this.y < 0 || this.y > height - scl) {
            return true;
        }

        return false;
    }

    dir(x, y) {
        this.xspeed = x;
        this.yspeed = y;
    }

    up() {
        if (this.yspeed !== 1) {
            this.xspeed = 0;
            this.yspeed = -1;
        }
    }

    down() {
        if (this.yspeed !== -1) {
            this.xspeed = 0;
            this.yspeed = 1;
        }
    }

    left() {
        if (this.xspeed !== 1) {
            this.xspeed = -1;
            this.yspeed = 0;
        }
    }

    right() {
        if (this.xspeed !== -1) {
            this.xspeed = 1;
            this.yspeed = 0;
        }
    }

    show() {
        fill(255, 255, 255, 100);

        for (var i = 0; i < this.tail.length; i++) {
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }

        rect(this.x, this.y, scl, scl);
    }

    drawFood() {
        fill(255, 0, 100);
        rect(this.food.x, this.food.y, scl, scl);
    }

    // underconstruction
    movingTowards() {
        if (this.x + this.xspeed - this.food.x < this.x - this.food.x || this.y + this.yspeed - this.food.y < this.y - this.food.y) {
            return false;
        }
        return true;
    }
}
