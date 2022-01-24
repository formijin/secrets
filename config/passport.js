const passport = require('passport');
const LocalStartegy = require("passport-local").Strategy;
const mongoose = require ("mongoose")
const bcrypt = require ("bcrypt");

// Load user model
const User = require ("../models/users");

module.exports = function (passport){
    passport.use (new LocalStartegy ({usernameField : "email"},function (username, password, done){
        
        // Match User
        User.findOne({username:username}, function (err, user) { 
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            // match password wih bcrypt
            bcrypt.compare (password, user.password, function (err, IsMatch) { 
                
                if (err) { console.log(err); }
                if (IsMatch){
                    return done(null, user);
                }else{
                    return done(null, false);
                }

            }); 
        });
       
    }));

    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
};