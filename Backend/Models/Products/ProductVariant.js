const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  size: {
    type: String,
  },
  color: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  imageVariant: {
    type: String,
  },
});

module.exports = mongoose.model("ProductVariant", productVariantSchema);
