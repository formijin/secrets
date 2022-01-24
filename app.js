require('dotenv').config();
const express = require ("express");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
const session = require('express-session');
const passport = require ("passport");
const bcrypt = require ("bcrypt");
const MongoStore = require('connect-mongo');







 // DB URI
 const db = process.env.MONGO_URI;

 // connect to Mongo
require("./config/Database").conneciton

// Load user model
const User = require ("./models/users");
 

 const app = express();

 app
 .use (express.static("public/"))
 .use (express.urlencoded({extended: false}))
 .set ("view engine", "ejs")
 .use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl:db }),
    cookie:{
        maxAge:100*60*60*24
    }
 }));

// passport middleware
app
.use(passport.initialize())
.use(passport.session());

//----- importing passport-local startegy config-------
require("./config/passport").local(passport);

//----importing oauth2 strategy config--------
// require("./config/passport").google(passport);





// Routes

app.use("/", require ("./routes/index"));
app.use("/users", require ("./routes/users"));





let port = process.env.PORT;

if( port == null || port == ""){
    port=3000
}

app.listen(port,function () { 
    console.log("Server started succesfully on "+ port);
 });