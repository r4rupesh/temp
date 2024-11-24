const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const model = mongoose.model;

const listSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
    image: {
        filename: { type: String, default: "default image"},
        url: {
          type: String,
          default: "https://unsplash.com/photos/sunset-over-the-horizon-xP_AGmeEa6s",
          set:(v)=>
            v===""? v:"https://unsplash.com/photos/sunset-over-the-horizon-xP_AGmeEa6s",
        },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }],
});

listSchema.post("findOneAndDelete",async (listing)=>{
        if(listing){
         await Review.deleteMany({_id:{$in:listing.reviews}});
        }
}
  
);

const Listing = model("Listing", listSchema);
module.exports = Listing;
