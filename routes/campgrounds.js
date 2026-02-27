const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    }))
    .post(
        isLoggedIn,
        upload.array('image'),
        validateCampground,
        catchAsync(async (req, res) => {

            const campground = new Campground(req.body.campground);

            campground.images = req.files.map(f => ({
                url: f.path,
                filename: f.filename
            }));

            campground.author = req.user._id;

            await campground.save();

            req.flash('success', 'Successfully created campground!');
            res.redirect(`/campgrounds/${campground._id}`);
        })
    );

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

module.exports = router;
