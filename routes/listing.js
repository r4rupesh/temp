const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncwrap");
const { schema } = require("../joiValidation.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js");
//Joi Validations
const listingValidate = (req, res, next) => {
  let { error } = schema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  asyncWrap,isLoggedin(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing.ejs", { allListing });
  })
);

//create route form
router.get("/new", isLoggedin, (req, res) => {
  res.render("new.ejs");
});

// Create route
router.post(
  "/",
  listingValidate,
  isLoggedin,
  asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
  })
);

// Show Route
router.get(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exitsts");
      res.redirect("/listing");
    }
    res.render("show.ejs", { listing });
  })
);

//Edit Route
router.get("/:id/edit", isLoggedin, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exitsts");
    res.redirect("/listing");
  }
  res.render("edit.ejs", { listing });
});

//Update Route
router.put(
  "/:id",
  isLoggedin,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = req.body.listing;
    if (!req.body.listing) {
      throw new ExpressError("404", "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect("/listing");
  })
);

//Delete Route

router.delete("/:id", isLoggedin, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listing");
});

module.exports = router;
