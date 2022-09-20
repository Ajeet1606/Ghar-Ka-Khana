const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const delivery_guySchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//Hashing password

delivery_guySchema.pre('save', async function(next) {
    console.log('Hi from inside');
    if (this.isModified('password')) {
        console.log("bcryptjs worked");
        this.password = await bcrypt.hash(this.password, 12);
        console.log(this.password);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

const Delivery_guy = mongoose.model("delivery_guys", delivery_guySchema);

module.exports = Delivery_guy;