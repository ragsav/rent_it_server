const mongoose = require("mongoose");
const crypto = require("crypto");
const { Timestamp, Double } = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
// user schema
const transactionScheama = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      required: true,
    },
    lot_id: {
      type: ObjectId,
      required: true,
    },
    plot_id: {
      type: ObjectId,
      required: true,
    },
    vehicle_id: {
      type: ObjectId,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    end_time: {
      type: Number,
      required: true,
    },
    extension: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    response: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionScheama);
