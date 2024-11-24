module.exports.isLoggedin =(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error","User must be log in");
       return res.redirect("/login");
      }
      next();
}