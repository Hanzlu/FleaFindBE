const express = require('express');
const City = require("../models/city.model.js");
const router = express.Router();

router.get('/', async (req,res) => {
    try {
        const cities = await City.find(); //use find({}) for getting all
        console.log(cities);
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.post('/', async (req,res) => {
    try {
        const city = await City.create(req.body);
        res.status(200).json(city);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;