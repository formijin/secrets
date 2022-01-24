module.exports.isAuth =function (req, res, next){
    if (req.isAuthenticated()) {
        next();
    }else{
        
        res.render("login")
        res.status(401).json({msg:"You are not authenticated"});
    }
}

module.exports.isAdmin = (req,res,next)=>{

}