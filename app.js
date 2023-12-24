const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");




const ListingRoutes = require("./routes/listing.js");
const ReviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(cookieParser());


main()
    .then(() => {
        console.log("connection successful to db");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.listen(port, () => {
    console.log("app is listen on port 8080");
});

const sessionOption = {
    secret: "mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expaires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.fail = req.flash("fail");
    res.locals.user = req.user;
    next();
});

app.get("/", (req, res) => {
    res.send("root route is working");
});


app.use("/listings", ListingRoutes);
app.use("/listings/:id/review", ReviewRoutes);
app.use("/",userRoutes);

app.use("/listings", (err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong" } = err;
    res.status(statuscode).render("listing/error.ejs", { err })
});

