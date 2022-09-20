// const exp = require('constants');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);
require("./db/conn");
const Message = require("./models/contactSchema");
const Kitchen = require("./models/kitchenSchema");
const async = require('hbs/lib/async');
const User = require('./models/userSchema');
const Delivery_guy = require('./models/delivery_guySchema');
const bcrypt = require('bcryptjs/dist/bcrypt');
const res = require('express/lib/response');

// const async = require('hbs/lib/async');
const mongoURI = "mongodb+srv://ajeetPatel:ORTEUWUTRI@cluster0.twosh8o.mongodb.net/GharKaKhana?retryWrites=true&w=majority"

const app = express();
const port = process.env.PORT || 3000;


//setting the path
const staticpath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialspATH = path.join(__dirname, "../templates/partials");
// console.log(path.join(__dirname, "../public"));


const store = new mongoDbSession({
    uri: mongoURI,
    collection: 'mySessions',
});


app.use(session({
    secret: 'key that will sign cookie',
    resave: false,
    saveUninitialized: false,
    store: store
}))

const auth = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');

//middleware
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));


app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticpath));

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialspATH);


//routing
app.get("/", (req, res) => {
    res.render("index");
})

app.get("/contact", (req, res) => {
    res.render("contact");
})

app.post("/contact", async (req, res) => {
    try {
        // res.send(req.body);
        let msg = await new Message({
            email: req.body.email,
            query: req.body.query
        });
        console.log(msg);
        msg.save();
        // alert("Form submitted");
        res.status(201).render("contact");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/user_registration", auth.isLoggedOut, (req, res)=>{
    res.render("user_registration");
})

//registeration
app.post("/user_registration", async (req, res) => {
    try {
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.redirect('back');
        }else if (req.body.password != req.body.cpassword) {
            //alert("Password mismatch");
            return res.status(422).json({ error: "password mismatch" });
        }else {
            let user = await new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword
            });
            console.log(user);
            //call bcrypt hashing
            user.save();
            //redirect to signin page
            res.status(201).redirect("login");
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

//login
app.post("/login", async (req, res) => {
    try {
        let userExist = await User.findOne({email: req.body.email});
        let kitchen_exist = await Kitchen.findOne({email: req.body.email});
        let dGuy_exist = await Delivery_guy.findOne({email: req.body.email});
        if (userExist || kitchen_exist || dGuy_exist) {
            if (userExist) {
                const isUserMatching = await bcrypt.compare(req.body.password, userExist.password);
                if (isUserMatching) {
                    console.log("User Found");
                    req.session.user_id = userExist._id;
                    return res.redirect("/user_dashboard"); //.status(201)
                }else{
                    console.log("User password mismatch");
                    return res.status(400).json({ error: "Invalid Credential" });
                }
            }else if (kitchen_exist) {
                const isKitchenMatching = await bcrypt.compare(req.body.password, kitchen_exist.password);
                if (isKitchenMatching) {
                    console.log("Kitchen Found");
                    req.session.user_id = kitchen_exist._id;
                    console.log('id stored');
                    res.status(201).redirect("/signedinPage");
                }else {
                    console.log("Kitchen password mismatch");
                    //console.log(kitchen_exist.password);
                    return res.status(400).json({ error: "Invalid Credential" });
                }
            }else if (dGuy_exist) {
                const isDGuyMatching = await bcrypt.compare(req.body.password, dGuy_exist.password);
                if (isDGuyMatching) {
                    console.log("Delivery Guy Found");
                    req.session.user_id = dGuy_exist._id;
                    // my_id =  userExist._id;
                    res.status(201).redirect("delivery_guy_dashboard");
                    return;
                }else {
                    console.log("Delivery Guy's password mismatch");
                    return res.status(400).json({ error: "Invalid Credential" });
                }
            }
        }
        else{
            console.log("User not found");
            return res.status(400).json({ error: "Invalid Credential" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.get("/faq", (req, res) => {
    res.render("faq");
})

app.get("/kitchen_register", auth.isLoggedOut, (req, res) => {
    res.render("kitchen_register");
})

app.post("/kitchen_register", async (req, res) => {
    try {
        const kitchen_exist = await Kitchen.findOne({ email: req.body.email });
        if (kitchen_exist) {
            return res.status(422).json({ error: "Email already exists" });
        }else if (req.body.password != req.body.cpassword) {
            return res.status(422).json({ error: "password mismatch" });
        }else {
            // res.send(req.body);
            let kitchen = await new Kitchen({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword,
                city: req.body.city,
                charge: req.body.charge,
                sunday: req.body.sunday,
                monday: req.body.monday,
                tuesday: req.body.tuesday,
                wednesday: req.body.wednesday,
                thursday: req.body.thursday,
                friday: req.body.friday,
                saturday: req.body.saturday
            });
            console.log(kitchen);
            kitchen.save();
            res.status(201).render("login");
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/user_register", (req, res) => {
    res.render("user_register");
})

//fetch kitchens
app.get("/kitchen_list", (req, res) => {
    Kitchen.find({}, function(err, ktch){
        res.render("kitchen_list", {
            kitchens: ktch
        })
    })
})
app.get("/kitchen_details/:id", async(req, res) => {
    console.log(req.params.id);
    const myId = req.params.id;
    const myKtch = await Kitchen.findById({_id: myId});
    console.log(myKtch);
    res.render("kitchen_details", {
        myKitchen: myKtch
    });
})

app.get("/placeOrder", (req, res) => {
    res.render("placeOrder");
})

app.get("/orderPlaced", (req, res) => {
    res.render("orderPlaced");
})

app.get("/delivery_guy_register", auth.isLoggedOut, (req, res) => {
    res.render("delivery_guy_register");
})

app.get("/login", auth.isLoggedOut, (req, res) => {
    res.render("login");
})


app.post("/delivery_guy_register", async (req, res) => {
    try {
        const dGuy_exist = await Delivery_guy.findOne({email: req.body.email});
        if (dGuy_exist) {
            return res.status(422).json({ error: "Email already exists" });
        }else if (req.body.password != req.body.cpassword) {
            return res.status(422).json({ error: "password mismatch" });
        }else{
            let delivery_guy = new Delivery_guy({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword,
                city: req.body.city
            })
            console.log(delivery_guy);
            delivery_guy.save();
            res.status(201).redirect("/login");
        }
    } catch (error) {
        res.status(501).send("error");
    }
})

//delivery dashboard

app.get("/delivery_guy_dashboard", auth.isLoggedIn, async(req, res)=> {
    try {
        const dGuy_Data = await Delivery_guy.findById({_id: req.session.user_id});
        // console.log(userData.sunday[0]);
        console.log('going to dashboard');
        res.render("delivery_guy_dashboard", {
            user: dGuy_Data
        });
    } catch (error) {
        console.log(error.message);
    }
})

// user dashboard 
app.get("/user_dashboard", auth.isLoggedIn, async(req, res)=> {
    try {
        const userData = await User.findById({_id: req.session.user_id});
        // console.log(userData.sunday[0]);
        console.log('going to dashboard');
        res.render("user_dashboard", {
            user: userData
        });
    } catch (error) {
        console.log(error.message);
    }
})

//for kitchen
app.get("/signedinPage", auth.isLoggedIn, async(req, res) =>{
    try {
        const kitchenData = await Kitchen.findById({_id: req.session.user_id});
        // console.log(req.session.user_id);
        console.log('going to dashboard');
        res.render("signedinPage", {
            user: kitchenData
        });
    } catch (error) {
        console.log(error.message);
    }
})

app.post("/logout", auth.isLoggedIn, async(req, res)=> {
    try {
        console.log('Logging out');
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
})


// create server

app.listen(port, () => {
    console.log('server is running on port ' + port);
})

// module.exports = my_id;