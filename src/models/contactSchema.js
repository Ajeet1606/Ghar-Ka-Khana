const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid");
            }
        }
    },
    query: {
        type: String,
        required: true, 
        maxLength: 400
    },
    date: {
        type: Date,
        default: Date.now
    }
})


// we need a collection 

const Message = mongoose.model("Query", contactSchema);

module.exports = Message;