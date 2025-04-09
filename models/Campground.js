const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50, 'Name cannot be more than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add an address']
    },
    tel:{
        type: String
    },
});

module.exports=mongoose.model('Campground', CampgroundSchema);