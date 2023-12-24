const mongoose = require("mongoose");
const {Schema} = mongoose;
const review = require("../models/review.js");
const listingSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

        },
    },
    price: {
        type: Number,
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
});

listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing.review.length){
        let res = await review.deleteMany({_id: {$in: listing.review}});
    }
})

const deleteid = async () =>{
   const result =  await review.findByIdAndDelete("65729e5b4d671c9d6995d573");
}


const listing = mongoose.model("listing",listingSchema);
module.exports = listing;