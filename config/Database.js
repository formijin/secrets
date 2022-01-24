const mongoose = require("mongoose");


const db = process.env.MONGO_URI;

const connection = mongoose.connect(db,function (err) {
    if (!err){
        console.log("DB connection successful");
    }else{
        console.log(err);
    }
});

module.exports.connection = connection