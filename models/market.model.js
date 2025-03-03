const mongoose = require('mongoose');

const MarketSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: {type: String, required: true, maxLength: 64},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    popup: {type: Boolean, required: true, default: false}, //is it a popup or not
    opening_hours: String, //handled by frontend
    city: {type: String, required: true, maxLength: 64},
    address: {type: String, required: true, maxLength: 250},
    location: String, //handled by frontend
    instagram_link: {type: String, maxLength: 250},
    facebook_link: {type: String, maxLength: 250},
    twitter_link: {type: String, maxLength: 250},
    website_link: {type: String, maxLength: 250},
    phone: {type: String, maxLength: 64},
    //array of categories (string) //categories
    //image list -- first object is logo
    image_list: {type: Array, default: [null, null, null, null, null, null, null, null, null, null, null]},
    //rating? either updated (prob. better) or calculated
    score_sum: {type: Number, default: 0}, 
    num_of_reviews: {type: Number, default: 0},
//Date.now is the date when object is created(?)
    created_at: {type: Date, default: Date.now}
});

const Market = mongoose.model('Market', MarketSchema);
module.exports = Market;