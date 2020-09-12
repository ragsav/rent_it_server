const mongoose = require("mongoose");
const crypto = require("crypto");
var ObjectId = require("mongodb").ObjectID;

// user schema
const plotScheama = new mongoose.Schema(
  {
    number: {
      type: Number,
      trim: true,
      required: true,
    },
    current_day_schedule: {
      type: [String],
      default: Array(24).fill(""),
    },

    type: {
      type: Number,
      default: 4,
    },
    history: {
      type: [String],
    },
    lot_id: {
      type: ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plot", plotScheama);
