const mongoose = require("mongoose");

const MainPageSchema = new mongoose.Schema({
  HeroName: {
    type: String,
    required: true,
  },
  HeroImage: {
    type: [String],
  },
  HeroDescription: {
    type: String,
    required: true,
  },
  HeroButton: {
    type: String,
    required: true,
  },
  CollectionsName:{
    type: String,
    required: true,
  },
  CollectionsDescription:{
    type: String,
    required: true,
  },
  OfferName:{
    type: String,
    required: true,
  },
  OfferDescription:{
    type: String,
    required: true,
  },
  AboutName:{
    type: String,
    required: true,
  },
  AboutDescription:{
    type: String,
    required: true,
  },
  AboutImage:{
    type: [String],
  },

});

module.exports = mongoose.model("MainPage", MainPageSchema);
