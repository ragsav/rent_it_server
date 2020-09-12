const mongoose = require("mongoose");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
// user schema
const userScheama = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    device_id: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    vehicles: {
      type: [ObjectId],
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    current_transaction: {
      type: String,
      default: "",
    },
    transaction_history: {
      type: [ObjectId],
    },
    schedule_dates: {
      type: [String],
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// virtual
userScheama
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userScheama.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userScheama);
