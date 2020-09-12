const jwt = require("jsonwebtoken");
exports.userResourseMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log(req);
  // console.log(authHeader);
  const token = authHeader;
  if (token == null) {
    res.status(401);
    return res.send(" hello bhai");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // console.log(err);
      if (err) {
        res.status(404);
        return res.send("Unauthorised 1");
      } else {
        // console.log(user);
        req.user = user;
        next();
      }
    });
  }
};
