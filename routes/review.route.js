const express = require('express');
const Review = require("../models/review.model.js");
const router = express.Router();

router.get('/', async (req,res) => {
    try {
        const { id } = req.params; //get the id from request
        const review = await Review.findById(id); //use find({}) for getting all
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.post('/', async (req,res) => {
    try {
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
        if (!review) { return res.status(404).json({message: "Review not found"}); }
        res.status(200).json({message: "Review deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;