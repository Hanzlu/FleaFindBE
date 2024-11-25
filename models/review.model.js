const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    id: mongoose.ObjectId,
    author: {type: String, required: true, maxLength: 64},
    review: {type: String, required: true, maxLength: 4096},
    rating: {type: Number, required: true},
    market: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Market'
    },
    //Date.now is the date when object is created(?)
    created_at: {type: Date, default: Date.now}
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;