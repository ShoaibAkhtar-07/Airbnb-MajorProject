const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const listing = require("../models/listing");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//Controller
const reviewController = require("../controller/reviews");

//Reviews POST Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReviews));

// Reviews DELETE ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;