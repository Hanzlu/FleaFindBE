const express = require('express');
const cloudinary = require('cloudinary').v2;
const Market = require("../models/market.model.js");
const Review = require('../models/review.model.js');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//6790a75f2a9098b672b168b5

//this is how multiple filters can be applied
router.get('/getByFilters', async (req, res) => {
    try {
        var filters = {};
        if (req.body.hasOwnProperty("city")) {
            filters.city = req.body.city;
        }
        if (req.body.hasOwnProperty("name")) {
            filters.name = req.body.name;
        }
        console.log(filters);
 
        const markets = await Market.find(filters);
        console.log(markets);
        res.status(200).json(markets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

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

//upload logo image:
//receives the image as a file
//uploads it to cloudinary and gets a link to it
//stores the link in the market DB model
router.post('/uploads/:market_id', upload.any('files'), async (req, res) => {
    try {
        const marketID = req.params.market_id; //get the id from request
        const market = await Market.findById(marketID); //use find({}) for getting all
        //upload the logo to cloudinary and get its cloudinary link
        //TODO, make this into a separate function
        const files = req.files; //uploaded images
        for (var i=0; i<files.length; i++) {
            //delete the old image
            if (market.image_list[i] != null) {
                cloudinary.uploader.destroy(market.image_list[i]);
            }
            //upload the new image
            results = await cloudinary.uploader.upload(files[i].path);
            url = cloudinary.url(results.public_id);
            //store the link in DB
            market.image_list[i] = url;
        }
            //update the market object in DB
    //const updated_market = await Market.findByIdAndUpdate(market_id, market);
        res.status(200).json({});
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