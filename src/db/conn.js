const mongoose = require('mongoose');

//creating db
try{
    mongoose.connect("mongodb+srv://ajeetPatel:ORTEUWUTRI@cluster0.twosh8o.mongodb.net/GharKaKhana?retryWrites=true&w=majority", {
        useNewUrlParser: true, useUnifiedTopology: true
    }, () => console.log('Connected Successfully'));
}catch(e){
    console.log('Oops, Cant connect');
}