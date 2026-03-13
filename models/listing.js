const mongoose = require("mongoose");
const { type } = require("node:os");
const Review = require("./review");
const User = require("./user");

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },

    country: {
        type: String
    },

    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}
);

listSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const listing = new mongoose.model("listing", listSchema);
module.exports = listing;