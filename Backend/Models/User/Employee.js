const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    DOH: {
      type: Date,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    isWorking: {
      type: Boolean,
      defaultValue: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", employeeSchema);
