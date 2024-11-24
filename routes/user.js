const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/asyncwrap");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
// signup page

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  asyncWrap(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      await User.register(newUser, password);
      req.flash("success", "Wecome to airbnb");
      res.redirect("/listing");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

// login page
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","Welcome back to airbnb");
    res.redirect("/listing");
  }
);
//logout route
router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
   if(err){
    return next(err);
   }
   req.flash("success","You are logged out!");
   res.redirect("/listing");
  });
});

module.exports = router;