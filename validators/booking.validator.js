exports.bookingValidatorMiddleware = (req, res, next) => {
  const { lot_id, time, duration } = req.body;
  var myRegEx = /^([a-zA-Z0-9 _-]+)$/;
  var result = myRegEx.test(lot_id);
  if (result === false) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  } else {
    var current_time = new Date().getHours();
    if (time <= current_time || duration > 3 || duration <= 0) {
      return res.status(400).json({
        error: "Please select proper time and duration",
      });
    } else {
      next();
    }
  }
};

exports.cancellingValidatorMiddleware = (req, res, next) => {
  const { lot_id, time, duration } = req.body;
  var myRegEx = /^([a-zA-Z0-9 _-]+)$/;
  var result = myRegEx.test(lot_id);
  if (result === false) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  } else {
    var current_time = new Date().getHours();
    if (time <= current_time || duration > 3 || duration <= 0) {
      return res.status(400).json({
        error: "Something went wrong",
      });
    } else {
      next();
    }
  }
};
