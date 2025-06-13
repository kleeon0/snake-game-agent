var food;
function generateFoodLocation() {
    var cols = floor(width / scl);
    var rows = floor(height / scl);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scl);
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
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xspeed = 1;
        this.yspeed = 0;
        this.total = 0;
        this.tail = [];

        // input nodes:
        //      head_x, head_y, tail_x, tail_y, x_speed, y_speed, total, food_x, food_y
        // hidden nodes:
        //      16 nodes in a single layer (constrained by the neural network configuration we're using)
        // output nodes:
        //      up, down, left, right
        this.brain = new NeuralNetwork(9, 16, 4);
    }

    think() {
        // Formatting the input to give to the neural network
        let inputs = [
            this.x, this.y,
            this.tail.length > 0 ? this.tail[0].x : this.x, this.tail.length > 0 ? this.tail[0].y : this.y,
            this.xspeed, this.yspeed,
            this.total,
            food.x, food.y
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

    update() {
        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1];
            }
        }

        this.tail[this.total - 1] = createVector(this.x, this.y);
        this.x = this.x + this.xspeed * scl;
        this.y = this.y + this.yspeed * scl;

        this.x = constrain(this.x, 0, width - scl);
        this.y = constrain(this.y, 0, height - scl);
    }

    eat(pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);

        if (d < 1) {
            this.total++;
            return true;
        }
        else {
            return false;
        }
    }

    death() {
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1) {
                this.total = 0;
                this.tail = [];
                this.xspeed = 1;
                this.yspeed = 0;
                this.x = 0;
                this.y = 0;

            }
        }

        if (this.x < 0 || this.x > width - scl || this.y < 0 || this.y > height - scl) {
            this.total = 0;
            this.tail = [];
        }
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
        fill(255);
        for (var i = 0; i < this.tail.length; i++) {
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }
        rect(this.x, this.y, scl, scl);
    }
}
