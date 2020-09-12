const mongoose = require("mongoose");
const crypto = require("crypto");
var ObjectId = require("mongodb").ObjectID;
// user schema
const vehicleScheama = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    user_id: {
      type: ObjectId,
      required: true,
    },
    image_binary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleScheama);
