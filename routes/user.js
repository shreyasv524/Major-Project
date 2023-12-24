const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");
const passportLocal = require("passport-local");
const {saveUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("./user/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new user({ email, username });
        const registeredUser = await user.register(newUser, password);
        req.login(registeredUser,(e) =>{
            if(e) {
                return next(e);
            }
        req.flash("success", "Welcome to Wonderlust");
            return res.redirect("/listings");
        })
    }
    catch (e) {
        req.flash("fail", "user are already exist");
        res.redirect('/signup');
    }
});


router.get("/login", (req, res) => {
    res.render("./user/login.ejs");
});

router.post('/login',saveUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: false }), (req, res) => {
        let {username} = req.body;
        req.flash("success", "Hello! Welcome back to Wonderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
       return res.redirect(redirectUrl);
});


router.get("/logout", (req, res, next) => {
 req.logout((err) =>{
    if(err){
        next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
 })
});

module.exports = router;
