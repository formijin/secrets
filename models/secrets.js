const mongoose = require ("mongoose");
const User = require("../models/users");

const secretSchema = new mongoose.Schema({
    body : String,
    date : {
        type : Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


const Secret =  mongoose.model ("Secret", secretSchema)

module.exports = Secret;