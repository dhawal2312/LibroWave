const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image:{
        type:String,
    },
    author:{
        type:String
    }
});

module.exports = Book = mongoose.model('book', BookSchema);