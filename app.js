require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/users');

const app = express();


// ================= DATABASE =================

// ✅ MongoDB Atlas connection (encoded password)
const dbUrl = process.env.DB_URL || 'mongodb+srv://sujithchuttugulla_db_user:Sujith%40258@yelp-camp.a9aj1bg.mongodb.net/yelp-camp?retryWrites=true&w=majority';

mongoose.connect(dbUrl)
    .then(() => {
        console.log("✅ Database connected");
    })
    .catch(err => {
        console.log("❌ Mongo connection error:", err);
    });


// ================= EXPRESS CONFIG =================

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// ================= SESSION CONFIG =================

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());


// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ================= GLOBAL VARIABLES =================

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// ================= ROUTES =================

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);

app.get('/', (req, res) => {
    res.redirect('/campgrounds');
});


// ================= SERVER =================

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Serving on port ${port}`);
});
