const dotenv = require('dotenv'); // bringing the functionality of dotenv
dotenv.config(); // using dotenv to bring the variables from the .env file

const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}`);
}) //when DB is connected, similar to the listen method 

//after connecting to DB above, bring route in with this "import"
const Fruit = require("./models/fruit.js");

//adding middleware
app.use(express.urlencoded({ extended: false }));


// GET /
app.get("/", async (req, res) => {
    res.render('index.ejs');
});


//GET / fruits/new
app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs')
})

//POST /fruits
app.post('/fruits', async (req, res) => {
    if (req.body.isReadytoEat === 'on') { // check box comes in as 'on'
        req.body.isReadytoEat = true; //so modifying it to match the schema here
    } else {
        req.body.isReadytoEat = false;
    }
    await Fruit.create(req.body); // this line is the database transaction
    res.redirect('fruits/new.ejs');
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
