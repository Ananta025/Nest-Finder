const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(listingController.index))    // Index route
    .post(
        isLoggedIn, 
        upload.single("image[url]"),
        validateListing, 
        wrapAsync(listingController.createListing)
    );    // Create route


// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))    // Show route
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single("image[url]"),
        validateListing, 
        wrapAsync(listingController.updateListing)
    )    // Update route    
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );  // Delete route



// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;
