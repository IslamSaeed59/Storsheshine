const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    Address: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
