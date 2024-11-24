const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");






const MONGODB_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => console.log("data base succefully connected"))
  .catch((err) => console.log(err));


async function main() {
  await mongoose.connect(MONGODB_URL);
}


async function initDoc(){
     await Listing.deleteMany({});
     await Listing.insertMany(initData.data);

}
initDoc();