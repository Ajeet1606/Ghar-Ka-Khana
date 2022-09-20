const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
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
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})



//Hashing password

userSchema.pre('save', async function(next) {
    console.log('Hi from inside');
    if (this.isModified('password')) {
        console.log("bcryptjs worked");
        this.password = await bcrypt.hash(this.password, 12);
        // console.log(this.password);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})


const User = mongoose.model("users", userSchema);

module.exports = User;