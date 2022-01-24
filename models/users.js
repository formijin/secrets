const mongoose = require ("mongoose");
const findOrCreate = require('mongoose-findorcreate');

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

// UserSchema.plugin(findOrCreate)

const User =  mongoose.model ("User", UserSchema)

module.exports = User;