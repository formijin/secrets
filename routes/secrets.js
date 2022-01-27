const express = require ("express");
const router = express.Router();
const isAuth = require ("./authMiddleware").isAuth;

// Define model
// const User = require("../models/users");
const Secret = require("../models/secrets");


// --------------------------Secrets---------------------------
router.get("/",(req,res,next)=>{ console.log(req.session);next();}, function (req,res){
    Secret.find({},"body",function (err,result) { 
        if(!err){
            console.log(result);
            console.log(result);
            res.render("secrets", {secrets: result});
        }else{console.log(err);}
        
    });
    
});



// ------------------------Submit secret---------------------------------
router.get ("/submit", (req,res,next)=> {
    res.render ("submit");
});

router.post ("/submit", (req,res, next)=>{
    // console.log(req.session.passport.user);
    // console.log(req.body.secret);
    // res.send("ok");
    const newSecret = new Secret ({
        body:req.body.secret,
        user: req.session.passport.user
    });
    newSecret.save(function (err, result) { 
        if(err){
            console.log(err);
        }else{
            res.redirect("/")
        }
    });

});

module.exports = router