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

const dbUrl = process.env.DB_URL;

console.log("DB URL:", dbUrl);

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
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

// ================= SESSION =================

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL =================

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
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
