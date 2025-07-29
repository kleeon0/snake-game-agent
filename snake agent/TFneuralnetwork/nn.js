class NeuralNetwork {
    constructor(input_layer, output_layer, lr = 0) {
        this.model = this.createNeuralNetwork(input_layer, output_layer, lr);
    }

    // Converts the model into a JSON format to save trained models
    serialize() {
        //TODO: Need to change this to the TensorFlow built-in serialisation
        return JSON.stringify(this);
    }

    // Creates a blank neural network and returns the model
    createNeuralNetwork(input_shape, output_shape, learning_rate) {
        const model = tf.sequential();

        // Add the hidden layers and specify the input and output layer size
        model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [input_shape] }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: output_shape, activation: 'relu' }));

        // Compile the model by specifying the loss and optimiser functions
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        return model
    }

    mutate() {

    }
}