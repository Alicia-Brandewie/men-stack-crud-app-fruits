const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
});

const Fruit = model('Fruit', fruitSchema); //first argument is the name of the file, the second is the name of the schema
module.exports = Fruit; //what we defined above 