const express = require ("express");
const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb://localhost:27017/userDB",function (err) {
    if (!err){
        console.log("DB connection successful");
    }else{
        console.log(err);
    }
});
const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    date : {
        type : Date,
        default: Date.now
    },
    googleId: String
});

const User =  mongoose.model ("User", UserSchema)

const app = express();

app.get ("/",function (req,res, next) { 
    User.findOne({email:"formijin4lyph@gmail.co"},function (err,result) { 
        console.log(result);
     });
 });



let port = process.env.PORT;

if( port == null || port == ""){
    port=3000
}

app.listen(port,function () { 
    console.log("Server started succesfully on "+ port);
 });