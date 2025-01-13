const mongoose = require('mongoose');

const OwnerSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    username: {type: String, required: true, maxLength: 64},
    firstname: {type: String, required: true, maxLength: 64},
    lastname: {type: String, required: true, maxLength: 64},
    password: {type: String, requred: true, maxLength: 64}, //hashed
    email: {type: String, required: true, maxLength: 64},
    phone: {type: String, required: true, maxLength: 64}
});

const Owner = mongoose.model('Owner', OwnerSchema);
module.exports = Owner;