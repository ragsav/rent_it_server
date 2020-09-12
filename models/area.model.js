const mongoose = require("mongoose");
const crypto = require("crypto");
var ObjectId = require("mongodb").ObjectID;
// user schema
const areaScheama = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lot_list: {
      type: [ObjectId],
      required: true,
    },
    city_id: {
      type: ObjectId,
      required: true,
    },
    image_binary: {
      type: String,
      default: "",
    },
    image_url: {
      type: String,
      default: "",
    },
    distance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Area", areaScheama);
