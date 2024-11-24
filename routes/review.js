const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const asyncWrap = require("../utils/asyncwrap");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema } = require("../joiValidation.js");

//Joi validations
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new ExpressError(404, error);
    } else {
      next();
    }
  };

//Reviews
//Post Route


router.post(
    "/",
    validateReview,
    asyncWrap(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     req.flash("success","New review created");
      res.redirect(`/listing/${req.params.id}`);
    })
  );
  //Delete Route
  router.delete(
    "/:reviewId",
    asyncWrap(async (req,res) => {
      let { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review deleted");
      res.redirect(`/listing/${id}`);
    }));
  

module.exports = router;