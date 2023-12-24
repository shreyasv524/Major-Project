const listing = require("./models/listing");
module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("fail", "must be logged in");
        res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isowner = async(req,res,next)=>{
    let { id } = req.params;

    let newlisting = await listing.findById(id);
    if(res.locals.user && (!res.locals.user._id.equals(newlisting.owner._id))){
        console.log(res.locals.user);
        console.log(newlisting.owner._id);
        req.flash("fail","You do not permission Because this is not your post");
        res.redirect(`/listings/${id}`);
    }
    next();
}