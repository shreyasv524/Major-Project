const express = require("express");
const router = express.Router({mergeParams: true});
const listing = require("../models/listing.js");
const review = require("../models/review.js");



router.post("/",async(req,res) =>{
    // console.log(res.locals.user);
    let listing1 =await listing.findById(req.params.id);
    let newreview = await new review(req.body.review);
    newreview.author = res.locals.user._id;
    // console.log(res.locals.user);
    console.log("This is a new review: ",newreview);
    listing1.review.push(newreview);
    await listing1.save();
    await newreview.save();
    req.flash("success","New review insert successfull");
    res.redirect(`/listings/${listing1._id}`);

});

router.delete("/:reviewid",async(req,res) =>{
    let {id, reviewid} = req.params;
    await listing.findByIdAndUpdate(id,{$pull: {review: reviewid}});
     const result = await review.findByIdAndDelete(reviewid);
    req.flash("success","Review is deleted");
    res.redirect(`/listings/${id}`);
});

module.exports = router;
