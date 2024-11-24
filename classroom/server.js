const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = session({
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
});

// intialize express session
app.use(sessionOptions);
// intialize flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.msg = req.flash("success");
  res.locals.err = req.flash("error");
  next();
});
app.get("/test", (req, res) => {
  res.send("test successull");
});

app.get("/register", (req, res) => {
  let { name = "Anonymous" } = req.query;
  req.session.name = name;
  if (name === "Anonymous") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user registered successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  let name = req.session.name;
  res.render("page.ejs", { name });
});
// app.get("/reqcount",(req,res)=>{
//     if(req.session.cookie){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`You sent  a request ${req.session.count} times`);
// });

app.listen(3000, (req, res) => {
  console.log("app is  listening on 3000");
});
