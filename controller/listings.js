const listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listings) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs", { listings });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Geocode the location
    try {
        const query = encodeURIComponent(newListing.location);
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        const response = await fetch(geoUrl, {
            headers: {
                "User-Agent": "WanderLust/1.0 (shoaibakhtar987987@gmail.com)"
            }
        });

        const data = await response.json();

        if (data.length > 0) {
            newListing.geometry = {
                type: "Point",
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
            };
        }
    } catch (err) {
        console.log("Geocoding failed:", err.message);
    }

    await newListing.save();
    req.flash("success", "New listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const foundlisting = await listing.findById(id);
    if (!foundlisting) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    };
    let orginalImageUrl = foundlisting.image.url;
    orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/e_blur:300");
    res.render("listings/edit.ejs", { foundlisting, orginalImageUrl })
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url, filename };
        await Listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let delListing = await listing.findByIdAndDelete(id);
    console.log(delListing);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
}