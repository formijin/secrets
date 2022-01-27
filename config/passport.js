const passport = require('passport');
const LocalStartegy = require("passport-local");
const mongoose = require ("mongoose")
const bcrypt = require ("bcrypt");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require('mongoose-findorcreate');
const FacebookStrategy = require ("passport-facebook")


// Load user model
const User = require ("../models/users");

module.exports = function (passport){
    passport.use (new LocalStartegy ({usernameField : "email"},function (username, password, done){
        
        // Match User
        User.findOne({email: username}, function (err, user) { 
          
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


    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/users/auth/google/secrets"
      },
      function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/users/auth/facebook/secrets"
      },
      function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
};

// module.exports.google = function (passport){
//     passport.use(new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/auth/google/secrets"
//       },
//       function(accessToken, refreshToken, profile, cb) {
//           console.log(profile);
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//           return cb(err, user);
//         });
//       }
//     ));

//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//       });
      
//       passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//           done(err, user);
//         });
//       });
// }