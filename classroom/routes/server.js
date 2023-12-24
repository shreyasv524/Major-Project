const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const session = require("express-session");
app.use(session({secret: "mysecreatestring",resave:false, saveUninitialized: true}));
app.use(flash());


app.listen(8080,() =>{
    console.log("app is listing on port");
});

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/register",(req,res) =>{
    let {name = "anonymos"} = req.query;
    req.session.name = name;
    if(name === "anonymos"){
        req.flash("error","user is not registered");
    }
    else{
        req.flash("success","user is registered");
    }
    // res.send("This was root page");
    res.redirect("/hello");
});

app.get("/hello",(req,res) =>{
    res.render("page.ejs",{name: req.session.name});
})

app.get("/countsession",(req,res) =>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }
    res.send(`Number of count is ${req.session.count}`);
});