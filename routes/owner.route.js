const express = require('express');
const Owner = require("../models/owner.model.js");
const router = express.Router();

router.get('/', async (req,res) => {
    try {
        const { id } = req.params; //get the id from request
        const owner = await Owner.findById(id); //use find({}) for getting all
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.post('/', async (req,res) => {
    try {
        const owner = await Owner.create(req.body);
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.put('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const owner = await Owner.findByIdAndUpdate(id, req.body);
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const owner = await Owner.findByIdAndDelete(id);
        if (!owner) { return res.status(404).json({message: "Owner not found"}); }
        res.status(200).json({message: "Owner deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;