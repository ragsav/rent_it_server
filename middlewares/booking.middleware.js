const User = require("../models/user.model");
exports.userBookingMiddleware = (req, res, next) => {
  const user_id = req.user._id;
  User.findOne({ _id: user_id }, (err, user) => {
    if (!err && user) {
      if (user.current_transaction === "") {
        next();
      } else {
        res.status(400).json({
          error: "cannot reserve multiple lots at same time",
        });
      }
    } else {
      res.status(401).json({
        error: "Unautharised request",
      });
    }
  });
};
