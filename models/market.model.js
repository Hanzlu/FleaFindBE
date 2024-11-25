const mongoose = require('mongoose');

const MarketSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: {type: String, required: true, maxLength: 64},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner'
    },
    opening_hours: String, //handled by frontend
    address: {type: String, required: true, maxLength: 250},
    location: String, //handled by frontend
    instagram_link: {type: String, maxLength: 250},
    facebook_link: {type: String, maxLength: 250},
    twitter_link: {type: String, maxLength: 250},
    website_link: {type: String, maxLength: 250},
    phone: {type: String, maxLength: 64},
    //array of categories (string) //categories
    //image list -- different object?
    //..also image for logo separately
//Date.now is the date when object is created(?)
    created_at: {type: Date, default: Date.now}
});

const Market = mongoose.model('Market', MarketSchema);
export default Market;