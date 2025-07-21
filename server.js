const dotenv = require('dotenv'); // bringing the functionality of dotenv
dotenv.config(); // using dotenv to bring the variables from the .env file

const app = express();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");



mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}`);
}) //when DB is connected, similar to the listen method 

mongoose.connect(process.env.MONGODB_URI);


//after connecting to DB above, bring route in with this "import"
const Fruit = require("./models/fruit.js");

//adding middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // allows to override methods 
//which essentially tricks our express app into thinking that we’ve made PUT and DELETE requests from the browser
app.use(morgan("dev")); //a logging tool for our HTTP requests, providing valuable insights into application behavior.



// GET /
app.get("/", async (req, res) => {
    res.render('index.ejs');
});

//GET
app.get('/fruits', async (req, res) => {//added the async earlier than notes here
    const allFruits = await Fruit.find({}); // allFruits = variable holding the data from the database call
    //  console.log(allFruits);
    res.render('fruits/index.ejs', { fruits: allFruits });
    //  res.send("Welcome to the fruits index page!"); 
    //res.send is functioning as console.log SO will change this logic later
});


//GET / fruits/new
app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs')
});

app.get("/fruits/:fruitId", async (req, res) => { // does adding async solve this eror? It should
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { fruit: foundFruit });
});

//POST /fruits
app.post('/fruits', async (req, res) => {
    if (req.body.isReadytoEat === 'on') { // check box comes in as 'on'
        req.body.isReadytoEat = true; //so modifying it to match the schema here
    } else {
        req.body.isReadytoEat = false;
    }
    await Fruit.create(req.body); // this line is the database transaction
    res.redirect('fruits');
});

//DELETE route
app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
});



//EDIT route
app.get('fruits/:fruitId/:fruitId', async (req, res) =>{
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log(foundFruit);
    res.render('fruits/edit.ejs', {
        fruit: foundFruit,
    });
});

app.put('/fruits/fruits:fruitId', async (req, res) =>{
    if (req.body.isReadytoEat === 'on') { 
        req.body.isReadytoEat = true; 
    } else {
        req.body.isReadytoEat = false;
    }
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body); //updates the fruit in the DB
    res.redirect(`/fruits/${req.params.fruitId}`);
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});
