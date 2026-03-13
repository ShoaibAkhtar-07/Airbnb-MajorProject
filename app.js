if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//Session and Flash
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');

//Express Routes
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");


//ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//ejs mate
app.engine('ejs', ejsMate);

//public
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//method-override
app.use(methodOverride("_method"));


const dns = require("dns");
dns.setServers(["1.1.1.1", "0.0.0.0"]);

//DataBase Url
const dbUrl = process.env.ATLASDB_URL;

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("DB connected successfully");
    } catch (err) {
        console.log("DB connection error:", err.message);
    }
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error occured in MONGO STORE SESSION", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wronge" } = err;
    res.render("error.ejs", { message });
    // res.status(status).send(message);
});

app.listen(port, () => {
    console.log("server is listening");
});