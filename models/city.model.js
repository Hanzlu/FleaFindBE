const mongoose = require('mongoose');

const CitySchema = mongoose.Schema({
    id: mongoose.ObjectId,
    name: String,
    description: String,
    //image: Buffer?? //store the image in some way (Cloudinery)
});

const City = mongoose.model('City', CitySchema);
export default City;