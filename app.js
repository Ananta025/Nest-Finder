if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const { saveRedirectUrl } = require("./middleware.js");


const MONGO_URL = process.env.MONGO_ATLAS_URL;

async function connectDB() {
    await mongoose.connect(MONGO_URL);
}
connectDB().then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.log("Error connecting to the database", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); // To parse the JSON data
app.use(express.urlencoded({ extended: true })); // To parse the form data
app.use(express.static(path.join(__dirname, "public"))); // To use the public folder
app.use(methodOverride("_method")); // To use method-override
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("err",()=>{
    console.log("Mongo-Session store error", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.engine("ejs", ejsMate); // To use ejs-mate as the template engine



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
}); // Middleware to set the flash messages

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
}); // To handle all the errors

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    if (!res.headersSent) {
        res.status(statusCode).render("listings/error.ejs", { err });
    } else {
        next(err);
    }
});

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});

