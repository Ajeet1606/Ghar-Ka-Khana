const express = require('express');
const res = require("express/lib/response");
const async = require("hbs/lib/async");

const isLoggedIn = async(req, res, next) => {
    try {
        if (req.session.user_id) {
            console.log("signed in");
            next();
        }
        else{
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLoggedOut = async(req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect("/");
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLoggedIn, isLoggedOut
}