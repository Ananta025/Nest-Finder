const User = require("../models/user");


module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register.ejs");
};

module.exports.registerUser = async(req, res) => {
    try{
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Welcome to Nest Finder!");
            res.redirect("/listings");
        });

    }catch(err){
        req.flash("error", err.message);
        res.redirect("/register");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser = async(req, res) => {
    req.flash("success", "Welcome back! into Nest Finder!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });

};