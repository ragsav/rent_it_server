const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
var createError = require("http-errors");
const { CronJob } = require("cron");

// Config dotev
require("dotenv").config({
  path: "./config/config.env",
});

// var CronJon = require("cron").CronJob;
// var job = new CronJob("*/2 * * * * *", () => {
//   console.log("hello");
// });

// job.start();
// config database
connectDB();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const publicRouter = require("./routes/public.route");

// // Dev Loggin Middleware
// if (process.env.NODE_ENV === "development") {
//   app.use(
//     cors({
//       origin: process.env.CLIENT_URL,
//     })
//   );
//   app.use(morgan("dev"));
// }
const PORT = process.env.PORT || 5000;

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api/", adminRouter);
app.use("/api/public", publicRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     msg: "Page not founded",
//   });
// });
app.listen(PORT, () => {
  console.log(`auth server listening on port ${PORT}`);
});
