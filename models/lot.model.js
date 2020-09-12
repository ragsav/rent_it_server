const mongoose = require("mongoose");
const crypto = require("crypto");
const { Timestamp } = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
// user schema
const lotScheama = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    open_time: {
      type: Number,
    },
    close_time: {
      type: Number,
    },
    active_plots_list: {
      type: [ObjectId],
    },
    passive_plots_list: {
      type: [ObjectId],
    },
    city_id: {
      type: ObjectId,
    },
    area_id: {
      type: ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lot", lotScheama);
