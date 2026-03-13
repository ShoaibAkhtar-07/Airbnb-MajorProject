const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

//Controller
const userController = require("../controller/users");

router.route("/login")
    .get(
        userController.renderLogInForm
    )
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login
    );

router.route("/signup")
    .get(
        userController.renderSignUpForm
    )
    .post(
        wrapAsync(userController.signup)
    );


router.get("/logout", userController.logout);

module.exports = router;