// Other techniques for learning
class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
}

let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
);

let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
);

class OldNeuralNetwork {
    // a is the number of input nodes
    // b is the number of nodes in the hidden layer (there is only one hidden layer)
    // c is the number of output nodes
    constructor(a, b, c, d) {
        if (a instanceof OldNeuralNetwork) {
            this.input_nodes = a.input_nodes;
            this.hidden_nodes = a.hidden_nodes;
            this.second_hidden =a.second_hidden;
            this.output_nodes = a.output_nodes;

            this.weights_ih1 = a.weights_ih1.copy();
            this.weights_h1h2 = a.weights_h1h2.copy();
            this.weights_h2o = a.weights_h2o.copy();

            this.bias_h1 = a.bias_h1.copy();
            this.bias_h2 = a.bias_h2.copy();
            this.bias_o = a.bias_o.copy();
        } else {
            this.input_nodes = a;
            this.hidden_nodes = b;
            this.second_hidden = b;
            this.output_nodes = c;

            this.weights_ih1 = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_h1h2 = new Matrix(this.second_hidden, this.hidden_nodes);
            this.weights_h2o = new Matrix(this.output_nodes, this.second_hidden);
            this.weights_ih1.randomize();
            this.weights_h1h2.randomize();
            this.weights_h2o.randomize();

            this.bias_h1 = new Matrix(this.hidden_nodes, 1);
            this.bias_h2 = new Matrix(this.second_hidden, 1);
            this.bias_o = new Matrix(this.output_nodes, 1);
            this.bias_h1.randomize();
            this.bias_h2.randomize();
            this.bias_o.randomize();
        }

        // TODO: copy these as well
        this.setLearningRate();
        this.setActivationFunction();
    }

    predict(input_array) {
        // Generating the Hidden Outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih1, inputs);
        hidden.add(this.bias_h1);
        // activation function!
        hidden.map(this.activation_function.func);

        //second hidden layer
        let second_hidden = Matrix.multiply(this.weights_h1h2, hidden);
        second_hidden.add(this.bias_h2);
        // activation function!
        second_hidden.map(this.activation_function.func);

        // Generating the output's output!
        let output = Matrix.multiply(this.weights_h2o, second_hidden);
        output.add(this.bias_o);
        output.map(this.activation_function.func);

        // Sending back to the caller!
        return output.toArray();
    }

    setLearningRate(learning_rate = 0.1) {
        this.learning_rate = learning_rate;
    }

    setActivationFunction(func = sigmoid) {
        this.activation_function = func;
    }

    train(input_array, target_array) {
        let inputs = Matrix.fromArray(input_array);

        // Generating the hidden 1 outputs
        let hidden1 = Matrix.multiply(this.weights_ih1, inputs);
        hidden1.add(this.bias_h1);
        // activation function!
        hidden1.map(this.activation_function.func);

        // Generating the hidden 2 outputs
        let hidden2 = Matrix.multiply(this.weights_h1h2, inputs);
        hidden2.add(this.bias_h2);
        // activation function!
        hidden2.map(this.activation_function.func);

        // Generating the output's output!
        let outputs = Matrix.multiply(this.weights_h2o, hidden2);
        outputs.add(this.bias_o);
        outputs.map(this.activation_function.func);

        // Convert array to matrix object
        let targets = Matrix.fromArray(target_array);

        // Calculate the error
        // ERROR = TARGETS - OUTPUTS
        let output_errors = Matrix.subtract(targets, outputs);

        // Calculate gradient
        let gradients = Matrix.map(outputs, this.activation_function.dfunc);
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);

        // Calculate deltas
        let hidden2_T = Matrix.transpose(hidden2);
        let weight_h2o_deltas = Matrix.multiply(gradients, hidden2_T);

        // Adjust the weights by deltas
        this.weights_h2o.add(weight_h2o_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_o.add(gradients);

        // Calculate the hidden layer errors
        let wh2o_t = Matrix.transpose(this.weights_h2o);
        let hidden2_errors = Matrix.multiply(wh2o_t, output_errors);

        // Calculate hidden gradient
        let hidden2_gradient = Matrix.map(hidden2, this.activation_function.dfunc);
        hidden2_gradient.multiply(hidden2_errors);
        hidden2_gradient.multiply(this.learning_rate);

        // Calcuate input->hidden deltas
        let inputs_T = Matrix.transpose(inputs);
        let weight_ih1_deltas = Matrix.multiply(hidden2_gradient, inputs_T);

        this.weights_ih1.add(weight_ih1_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_h1.add(hidden2_gradient);

        // outputs.print();
        // targets.print();
        // error.print();
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new OldNeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes, data.second_hidden);
        nn.weights_ih1 = Matrix.deserialize(data.weights_ih1);
        nn.weights_h1h2 = Matrix.deserialize(data.weights_h1h2);
        nn.weights_h2o = Matrix.deserialize(data.weights_h2o);
        nn.bias_h1 = Matrix.deserialize(data.bias_h1);
        nn.bias_h2 = Matrix.deserialize(data.bias_h2);
        nn.bias_o = Matrix.deserialize(data.bias_o);
        nn.learning_rate = data.learning_rate;
        return nn;
    }

    // Adding function for neuro-evolution
    copy() {
        return new OldNeuralNetwork(this);
    }

    mutate(rate) {
        function mutate(val) {
            if (Math.random() < rate) {
                // return 2 * Math.random() - 1;
                return val + randomGaussian(0, 0.1);
            } else {
                return val;
            }
        }
        this.weights_ih1.map(mutate);
        this.weights_h1h2.map(mutate);
        this.weights_h2o.map(mutate);
        this.bias_h1.map(mutate);
        this.bias_h2.map(mutate);
        this.bias_o.map(mutate);
    }
}