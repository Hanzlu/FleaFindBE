//NOTE!
//You cannot connect to MongoDB unless your IP address has been added in MongoDB Atlas.
//Ask "me" for the email and password. I might be able to give access to all IP addresses too.

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//import models
const City = require('./models/city.model.js'); //city will not be used as a DB model
const Owner = require('./models/owner.model.js');
const Market = require('./models/market.model.js');
const Review = require('./models/review.model.js');

//environmental variables
const MongoDB_URL = process.env.MongoDB_URL;

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


/* THESE TWO WERE USED FOR TESTING */

app.post('/api/city', async (req, res) => {
    try {
        const city = await City.create(req.body);
        res.status(200).json(city);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/api/city', async (req, res) => {
    try {
        const cities = await City.find(); //use find({}) for getting all
        console.log(cities);
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//-------------------------------
/* GET REQUESTS FOR EACH MODEL */
// TODO:
// - market by city
// - owner by market(?)
// - review by market

app.get('/api/market/:id', async (req, res) => {
    try {
        const { id } = req.params; //get the id from request
        const market = await Market.findById(id); //use find({}) for getting all
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/api/owner/:id', async (req, res) => {
    try {
        const { id } = req.params; //get the id from request
        const owner = await Owner.findById(id); //use find({}) for getting all
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/api/review/:id', async (req, res) => {
    try {
        const { id } = req.params; //get the id from request
        const review = await Review.findById(id); //use find({}) for getting all
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//--------------------------------
/* POST REQUESTS FOR EACH MODEL */

app.post('/api/market', async (req, res) => {
    try {
        const market = await Market.create(req.body);
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/api/owner', async (req, res) => {
    try {
        const owner = await Owner.create(req.body);
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/api/review', async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//--------------------------------
/* PUT REQUESTS FOR EACH MODEL */
//put is used to post an update of a model

app.put('api/market/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const market = await Market.findByIdAndUpdate(id, req.body);
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.put('api/owner/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await Owner.findByIdAndUpdate(id, req.body);
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.put('api/review/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndUpdate(id, req.body);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//----------------------------------
/* DELETE REQUESTS FOR EACH MODEL */

app.delete('api/market/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const market = await Market.findByIdAndDelete(id);
        if (!market) { return res.status(404).json({message: "Market not found"}); }
        res.status(200).json({message: "Market deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.delete('api/owner/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await Owner.findByIdAndDelete(id);
        if (!owner) { return res.status(404).json({message: "Owner not found"}); }
        res.status(200).json({message: "Owner deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.delete('api/review/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);
        if (!review) { return res.status(404).json({message: "Review not found"}); }
        res.status(200).json({message: "Review deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});