const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const kitchenSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid");
            }
        }
    },
    password: {
        type: String,
        required: true, 
        minLength: 5
    },
    cpassword: {
        type: String,
        required: true, 
        minLength: 5
    },
    city: {
        type: String,
        required: true
    },
    charge: {
        type: Number,
        required: true
    },
    sunday: {
        type: Array,
        required: true
    },
    monday: {
        type: Array,
        required: true
    },
    tuesday: {
        type: Array,
        required: true
    },
    wednesday: {
        type: Array,
        required: true
    },
    thursday: {
        type: Array,
        required: true
    },
    friday: {
        type: Array,
        required: true
    },
    saturday: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//Hashing password

kitchenSchema.pre('save', async function(next) {
    console.log('Hi from inside');
    if (this.isModified('password')) {
        console.log("bcryptjs worked");
        this.password = await bcrypt.hash(this.password, 12);
        console.log(this.password);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

// make the collection and tell mongoose about it
const Kitchen = mongoose.model("kitchen", kitchenSchema);
module.exports = kitchenSchema;
module.exports = Kitchen;