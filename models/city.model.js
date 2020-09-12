const mongoose = require("mongoose");
const crypto = require("crypto");
var ObjectId = require("mongodb").ObjectID;
// user schema
const cityScheama = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    area_list: {
      type: [ObjectId],
    },
    lot_list: {
      type: [ObjectId],
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("City", cityScheama);
