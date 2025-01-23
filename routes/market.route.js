const express = require('express');
const Market = require("../models/market.model.js");
const Review = require('../models/review.model.js');
const router = express.Router();

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params; //get the id from request
        const market = await Market.findById(id); //use find({}) for getting all
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get all markets in a city (String)
//returns empty string if none
router.get('/getByCity/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const markets = await Market.find( {city: city} );
        res.status(200).json(markets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get all markets owned by an owner (id)
//returns empty string if none
router.get('/getByOwner/:ownerID', async (req, res) => {
    try {
        const { ownerID } = req.params;
        const markets = await Market.find( {owner: ownerID} );
        res.status(200).json(markets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get all popup markets in a city
router.get('/getPopupsByCity/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const markets = await Market.find( {popup: true, city: city} ); //requires two criteria
        res.status(200).json(markets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// TODO
//get all markets above a certain rating
//:this requires calculating or storing the rating

router.post('/', async (req,res) => {
    try {
        const market = await Market.create(req.body);
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const market = await Market.findByIdAndUpdate(id, req.body);
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const market = await Market.findByIdAndDelete(id);
        if (!market) { return res.status(404).json({message: "Market not found"}); }
        res.status(200).json({message: "Market deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;