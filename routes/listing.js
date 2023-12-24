const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const listing = require("../models/listing.js");
const { isLogedIn , isowner} = require("../middleware.js");




router.get("/", wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render("./listing/index.ejs", { allListings });
}));


router.get("/new", isLogedIn, (req, res) => {
    return res.render("./listing/new.ejs");
});

router.post("/", async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, (_message));
    }
    try {
        const newlisting = req.body.listing;
        let newlist = new listing(newlisting);
        newlist.owner = req.user._id;
        console.log(req.user._id);
        newlist.save()
        req.flash("success", "listing was inserted successfull");
        res.redirect("/listings");

    }
    catch (err) {
        next(err);
    }
}
);

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingg = await listing.findById(id).populate("review").populate("owner");
    if (!listingg) {
        req.flash("fail", "listing does not exist");
        res.redirect("/listings");
        next(new ExpressError(404, "enter right id"));

    }
    // console.log("User: ",res.locals.user);
    let a = res.locals.user;
    // console.log("Owner: ",listingg.owner);
    res.render("listing/show.ejs", { listingg, a});
}));

router.get("/edit/:id", isLogedIn,isowner, wrapAsync(async (req, res) => {

    let { id } = req.params;
    let newlisting = await listing.findById(id);
    // if(!res.locals.user._id.equals(newlisting.owner._id)){
    //     console.log(res.locals.user);
    //     console.log(newlisting.owner._id);
    //     req.flash("fail","You do not permission Because this is not your post");
    //     res.redirect(`/listings/${id}`);
    // }
    if (!newlisting) {
        req.flash("fail", "listing doesn't exist");
        res.redirect("/listings");
        res.redirect("/listings");
        next(new ExpressError(404, "chat not found"));
    }
    else {
        res.render("listing/edit.ejs", { newlisting });
    }
}

));

router.put("/edit/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    let updated = await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "listing update successfull");
    res.redirect("/listings");

}));

router.delete("/delete/:id", isLogedIn, wrapAsync(async (req, res) => {

    let { id } = req.params;
    let deleted = await listing.findByIdAndDelete(id);
    req.flash("success", "listing was deleted");
    res.redirect("/listings");
}));

module.exports = router;