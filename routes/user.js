const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');

router
    .route("/register")
    .get(wrapAsync(userController.renderRegisterForm))
    .post(wrapAsync(userController.registerUser));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        userController.loginUser
    );


router.get("/logout", userController.logoutUser);



module.exports = router;