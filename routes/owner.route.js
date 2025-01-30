const express = require('express');
const Owner = require("../models/owner.model.js");
const bcrypt = require('bcrypt');
const router = express.Router();

//i'm going to assume JSON for now
//also assuming email only (let's change this later)
router.get('/checkLogin/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const owner = await Owner.find( {email: email} ); //get the owner with the login email
        const isValid = await bcrypt.compare(password, owner[0].password); //[0] because it returns a list
        if (!isValid) {
            res.send("incorrect password"); //TODO add a status
        } else {
            res.status(200).send("correct");
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//this function needs to be after checkLogin (bad practices)
router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params; //get the id from request
        const owner = await Owner.findById(id); //use find({}) for getting all
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//TODO only one user per email or whatever is used to login
router.post('/', async (req,res) => {
    try {
        //get the password and hash it
        const { password } = req.body;
        const hash = await bcrypt.hash(password, 10); //2^10 iterations min. recommendation
        req.body.password = hash; //put the hashed password into the JSON
        //store the owner object
        const owner = await Owner.create(req.body);
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.put('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        //get the password and hash it
        const { password } = req.body;
        const hash = await bcrypt.hash(password, 10); //2^10 iterations min. recommendation
        req.body.password = hash; //put the hashed password into the JSON
        //store the owner object
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