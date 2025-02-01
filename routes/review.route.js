const express = require('express');
const Review = require("../models/review.model.js");
const Market = require("../models/market.model.js");
const router = express.Router();

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params; //get the id from request
        const review = await Review.findById(id); //use find({}) for getting all
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//get all the reviews for a particular market
router.get('/getByMarket/:marketID', async (req, res) => {
    try {
        const { marketID } = req.params; //get the market
        const reviews = await Review.find( {market: marketID} );
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({message: error.message});  
    }
});

router.post('/', async (req,res) => {
    try {
        // get the market id from the json
        const { marketID } = req.body.market;
        // get the market with that id
        const market = await Market.findById(marketID);
        // update the market object
        market.score_sum = market.score_sum + req.body.score;
        market.num_of_reviews = market.num_of_reviews + 1;
        // save the review object
        const review = await Review.create(req.body);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndUpdate(id, req.body);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);
         // get the market id from the json
         const { marketID } = review.market;
         // get the market with that id
         const market = await Market.findById(marketID);
         // update the market object
         market.score_sum = market.score_sum - review.score;
         market.num_of_reviews = market.num_of_reviews - 1;
         // save the review object
        if (!review) { return res.status(404).json({message: "Review not found"}); }
        res.status(200).json({message: "Review deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;