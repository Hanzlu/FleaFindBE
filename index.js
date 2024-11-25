const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//environmental variables
const MongoDB_URL = process.env.MongoDB_URL;

//import models
// const City = require('./models/city.model.js');
// const Owner = require('./models/owner.model.js');
// const Market = require('./models/market.model.js');
// const Review = require('./models/review.model.js');

const app = express();

//middleware
app.use(express.json()); //allow json
//1:09:00 [1] for HTML forms (?)

//connect to mongoDB and start the server
mongoose.connect(MongoDB_URL) //environmental variable containing login credentials
.then(() => {
    console.log("Connected to the database...");
    //start the server
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
})
.catch(() => {
    console.log("Failed to connect to database.");
});


app.get('/', (req, res) => {
    console.log("GET /");
    res.sendFile(__dirname+"/pages/index.html");
    //res.send("Hello from server");
});


console.log("Hi there. It is testing");

/**
app.post('/', async (req, res) => {
    try {
        const market = await Market.create(req.body);
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}); */


/**
app.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; //get the id from request
        const market = await Market.findById(id); //use find({}) for getting all
        res.stauts(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}); */

/**
app.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const market = await Market.findByIdAndUpdate(id, req.body);
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}); */

/**
app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const market = await Market.findByIdAndDelete(id);
        if (!market) { return res.status(404).json({message: "Market not found"}); }
        res.status(200).json({message: "Market deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}) */