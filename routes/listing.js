const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");


//controller 
const listingController = require("../controller/listings");

//Cloudiinary && Multer & Both
const multer = require('multer');
const { storage, cloudinary } = require("../cloudConflict");
const upload = multer({ storage });

//Create NEW Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Index Route    //Create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


// SHOW ROUTE    //Update Route   //Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;