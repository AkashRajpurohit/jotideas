require("dotenv").config();
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 5000;

// DB Config
const db = require("./config/database");

// Connect to MongoDB
mongoose
  .connect(db.mongoURI)
  .then(() => console.log(`MongoDB Running at ${db.environment} Environment..`))
  .catch(err => console.log(err));

// Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Load Passport Config
require("./config/passport")(passport);

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

////////////////////////////////////////////////////////

// MIDDLEWARES

// HandleBars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-Override Middleware
app.use(methodOverride("_method"));

// Express-Session Middleware
app.use(
  session({
    secret: process.env.SECRETORKEY,
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash MiddleWare
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

////////////////////////////////////////////////////////

//ROUTING

// Index Route
app.get("/", (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render("index");
});

// About Route
app.get("/about", (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render("about");
});

// Use Routes
app.use("/ideas", ideas);
app.use("/users", users);

//////////////////////////////////////////////////

// If not a valid Route then route to 404
app.get('*', function(req, res){
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server Started at Port ${port}`);
});
