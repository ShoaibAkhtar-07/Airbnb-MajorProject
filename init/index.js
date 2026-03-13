const mongoose = require("mongoose");
const initData = require("./data");
const listing = require("../models/listing");

main().then(() => {
    console.log("connected to db");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69ab215f900c657092569aa1" }));
    await listing.insertMany(initData.data);
};

initDB();
