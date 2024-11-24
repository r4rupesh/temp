const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const MONGODB_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
main()
  .then((res) => console.log("data base succefully connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGODB_URL);
}

//intialize sessions optioins
const sessionOptions = session({
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
});

//home route
app.get("/", (req, res) => {
  res.send("This is home");
});

//use session optioins
app.use(sessionOptions);

//flash use.
app.use(flash());

//passport intialization.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for flash message.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// //for demo user passport authentication.
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
//   console.log(registeredUser);
// });

//Router Middleware
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);


//For route not exists.
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//Error handling middleware.
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SomeThing went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  console.log(err);
});

//Req listening.
app.listen(8080, () => {
  console.log("app is listening on 8080");
});