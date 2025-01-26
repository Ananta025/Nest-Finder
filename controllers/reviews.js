const Listing = require('../models/listing');
const Review = require('../models/review');
module.exports.createReview = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved",newReview);
    // console.log("New listing saved");
    res.redirect(`/listings/${id}`);
    // res.send("Review added");
};

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};

