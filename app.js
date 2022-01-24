require('dotenv').config();
const express = require ("express");
// const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require ("passport");
const bcrypt = require ("bcrypt");
const MongoStore = require('connect-mongo');
const isAuth = require ("./routes/authMiddleware").isAuth;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require('mongoose-findorcreate');




 // DB config
 const db = require("./config/keys").MongoURI;

 // connect to Mongo
 mongoose.connect(db,function (err) {
     if (!err){
         console.log("DB connection successful");
     }else{
         console.log(err);
     }
 });

// Load user model
const User = require ("./models/users");
 

 const app = express();

 app
 .use (express.static("public"))
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

//----google oauth2 strategy--------
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// introducing passport config
require("./config/passport")(passport);



// Routes

app.use("/", require ("./routes/index"));
app.use("/users", require ("./routes/users"));

app.get("/secrets",isAuth, function (req,res){
    
    res.render("secrets");
    
});

app.get("/auth/google", passport.authenticate('google', { scope: ['profile'] }));

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


// app.get("/register", function (req, res) { 
//    res.render("register");
  
// });

// app.post("/register", function (req,res) {  

//    User.register({username: req.body.username}, req.body.password, function(err,user){
//        if(err){
//            console.log(err);
//            res.redirect("/register");
//        }else{
           
//            passport.authenticate("local"), (function(req,res){
//                console.log(req.user);
//                res.redirect("/secrets");
            
//            });
//        }
//    });
    
// });

let port = process.env.PORT;

if( port == null || port == ""){
    port=3000
}

app.listen(port,function () { 
    console.log("Server started succesfully on "+ port);
 });