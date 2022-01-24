const express = require ("express");
const router = express.Router();
const bcrypt = require ("bcrypt");
const passport = require ("passport");
const isAuth = require ("./authMiddleware").isAuth;

// Define model
const User = require("../models/users");

// -------------------------------login page--------------------------------

router.get ("/login", function (req, res) { 
    
    res.render("login");
});

router.post ("/login", passport.authenticate("local",{ 
        successRedirect: '/users/secrets',
        failureRedirect: '/users/login' 
    })
);

router.get("/auth/google", passport.authenticate('google', { scope: ['profile'] }));


//------------------------------------Registration page---------------------------------

router.get ("/register", function (req, res) { 
    
    res.render("register");

});

router.post ( "/register", function (req, res) { 

    // Create user entry for mongo
    const newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    
    // Hash user's password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newUser.password, salt);

    // Update user entry with hashed password
    newUser.password = hash

    // save user 
    newUser.save(function (err, result) { 
        if(err){
            console.log(err);
        }else{
            res.redirect("/users/login")
        }
    });
    


});

// -------------------------logout ---------------------------
router.get("/logout", function (req,res,next) {
    req.logout();
    res.redirect('/');
})

// --------------------------Secrets---------------------------
router.get("/secrets",(req,res,next)=>{ console.log(req.session);next();}, isAuth, function (req,res){
    
    res.render("secrets");
    
});

router.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/users/secrets');
  });

module.exports = router