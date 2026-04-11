const mongoose = require("mongoose");
const Listing = require("../models/listing");

require("dotenv").config();

async function updateAll() {
    await mongoose.connect(process.env.ATLASDB_URL);
    const listings = await Listing.find({ "geometry.coordinates": { $exists: false } });
    
    for (let listing of listings) {
        const query = encodeURIComponent(listing.location);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.length > 0) {
            listing.geometry = {
                type: "Point",
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
            };
            await listing.save();
            console.log(`Updated: ${listing.title}`);
        } else {
            console.log(`Could not find coords for: ${listing.title}`);
        }
        
        // Nominatim requires 1 second delay between requests
        await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log("Done!");
    mongoose.connection.close();
}

updateAll();
