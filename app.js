require('dotenv').config();
const express = require ("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');




const app = express();


app
.use (express.static("public"))
.use (bodyparser.urlencoded({
    extended: true
}))
.set ("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: {
        type : "String",
        required: true
    },
    password: {
        type : "String",
        required: true,
    }
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("user",userSchema);

app.get("/", function (req, res) { 
    res.render("home");
});


app.get("/login", function (req, res) { 
    res.render("login");
});


app.post("/login", function (req,res) {  
   
    User.findOne({email: req.body.email}, function(err,result){
        
        if (!err) {
            if (result) {
                if (result.password === req.body.password) {
                    res.render("secrets");
                }else{
                    res.send("Invalid password");
                } 
            }else{
                res.send("Invalid user");
            }
        } else {
            console.log(err);
        }

    });

});


app.get("/register", function (req, res) { 
    res.render("register");
});

app.post("/register", function (req,res) {  
   const newUser = new User(req.body)
    newUser.save( function (err, result) { 
        if(!err){
            res.render("secrets");
        }else{
            res.send(err)
        }
     })
})

let port = process.env.PORT;

if( port == null || port == ""){
    port=3000
}

app.listen(port,function () { 
    console.log("Server started succesfully");
 })