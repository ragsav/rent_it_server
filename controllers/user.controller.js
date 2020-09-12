const User = require("../models/user.model");
const City = require("../models/city.model");
const Vehicle = require("../models/vehicle.model");
const Lot = require("../models/lot.model");
const Plot = require("../models/plot.model");
const Transaction = require("../models/transaction.model");
const Area = require("../models/area.model");
const { ObjectId } = require("mongodb");
// const expressJwt = require("express-jwt");

exports.readController = async (req, res) => {
  const userId = req.user._id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;

    const vehicles = user.vehicles;

    Vehicle.find({ _id: { $in: vehicles } }, (err, vehiclesDoc) => {
      if (err) {
        res.status(200).json({
          success: true,
          user: user,
          vehicles: null,
        });
      } else {
        res.status(200).json({
          success: true,
          user: user,
          vehicles: vehiclesDoc,
        });
      }
    });
  });
};
exports.getUserTransactions = async (req, res) => {
  const userId = req.user._id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    } else {
      var transactions = [ObjectId];
      const user_transactions = user.transaction_history;
      // for (let i = 0; i < user_transactions.size(); i++) {
      //   transactions.push(new ObjectId(user_transactions.get(i)));
      // }

      Transaction.find({ _id: { $in: user_transactions } }, (err, trans) => {
        if (!err) {
          res.status(200).json({
            success: true,
            transactions: trans,
          });
        } else {
          res.status(400).json({
            success: false,
            error: err,
          });
        }
      });
    }
  });
};
exports.updateController = async (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password, prev_password } = req.body;
  const user_id = req.user._id;
  User.findOne({ _id: user_id }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        error: "User unautherised",
      });
    } else {
      if (user.authenticate(prev_password)) {
        User.findByIdAndUpdate(
          { _id: user_id },
          {
            name: name,
            password: password,
          },
          (err, oldUser) => {
            if (!err) {
              User.findOne({ _id: user_id }, (err, newUser) => {
                if (!err) {
                  return res.status(200).json({
                    success: false,
                    user: newUser,
                  });
                } else {
                  return res.status(401).json({
                    success: false,
                    error: "Something went wrong",
                  });
                }
              });
            } else {
              return res.status(401).json({
                success: false,
                error: "Something went wrong",
              });
            }
          }
        );
      } else {
        return res.status(401).json({
          success: false,
          error: "Password incorrect",
        });
      }
    }
  });
};
exports.updateNonPasswordController = async (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { transaction_history, schedule_dates } = req.body;
  const user_id = req.user._id;
  User.findOne({ _id: user_id }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        error: "User unautherised",
      });
    } else {
      User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: { transaction_history: transaction_history },
          $set: { schedule_dates: schedule_dates },
        },
        (err, oldUser) => {
          if (!err) {
            User.findOne({ _id: user_id }, (err, newUser) => {
              if (!err) {
                return res.status(200).json({
                  success: false,
                  user: newUser,
                });
              } else {
                return res.status(401).json({
                  success: false,
                  error: "Something went wrong",
                });
              }
            });
          } else {
            return res.status(401).json({
              success: false,
              error: "Something went wrong",
            });
          }
        }
      );
    }
  });
};
exports.signOut = async (req, res) => {
  const user_id = req.user._id;
  User.findOneAndUpdate({ _id: user_id }, { device_id: "" }, (err, user) => {
    if (user && !err) {
      res.status(200).json({
        success: true,
      });
    } else {
      res.send(400).json({
        success: false,
        error: err,
      });
    }
  });
};
exports.bookController = async (req, res) => {
  // const user_id = req.user._id;
  const { lot_id, time, duration } = req.body;
  const user_id = req.user._id;

  // const q = "current_day_schedule." + time;
  var query = {};
  query["lot_id"] = lot_id;
  for (let i = 0; i < duration; i++) {
    query["current_day_schedule." + (time + i)] = { $eq: "" };
  }
  Plot.findOne(query, (err_plot_finding, plot) => {
    if (!err_plot_finding && plot) {
      const transaction = new Transaction({
        user_id: user_id,
        lot_id: lot_id,
        plot_id: plot._id,
        duration: duration,
        time: time,
        end_time: duration + time,
        price: 0,
      });
      transaction.save((err_transaction_saving, transactionNew) => {
        if (!err_transaction_saving) {
          let schedule = plot.current_day_schedule;
          for (let i = 0; i < duration; i++) {
            schedule[time + i] = user_id;
          }
          Plot.findOneAndUpdate(
            //find and update plot
            { _id: plot._id },
            { $set: { current_day_schedule: schedule } },
            { returnOriginal: false },
            (err_updating_plot, plotNew) => {
              if (!err_updating_plot) {
                User.findOneAndUpdate(
                  { _id: user_id },
                  {
                    $addToSet: { transaction_history: transactionNew._id },
                    current_transaction: transactionNew._id,
                  },
                  (err_user_update, userNew) => {
                    if (!err_user_update) {
                      return res.status(200).json({
                        transaction: transactionNew,
                        plot: plotNew,
                        user: userNew,
                      });
                    } else {
                      Transaction.findOneAndDelete({ _id: transactionNew._id });
                    }
                  }
                );
                //update plot success
              } else {
                Transaction.findOneAndDelete({ _id: transactionNew._id }); //if update plot not success then delete the transaction
                console.log(err_updating_plot);
                return res.status(400).json({ error: "Server error" });
              }
            }
          );
        } else {
          //transaction not saved
          console.log(err_transaction_saving);
          return res.status(400).json({ error: "Transaction failed" });
        }
      });
    } else {
      //plot not found
      console.log(err_plot_finding);
      return res.status(400).json({ error: "No plot found for your time" });
    }
  });
};
exports.cancelController = async (req, res) => {
  // const user_id = req.user._id;
  const { transaction_id } = req.body;
  Transaction.findOne(
    { _id: transaction_id },
    (transaction_find_error, transaction) => {
      if (!transaction_find_error) {
        const { user_id, lot_id, plot_id, time, duration } = transaction;
        Plot.findOne({ _id: plot_id }, (plot_find_error, plot) => {
          if (!plot_find_error) {
            let scheduleArray = plot.current_day_schedule;
            let infoCorrect = true;
            for (let i = 0; i < duration; i++) {
              if (scheduleArray[time + i] == user_id) {
                scheduleArray[time + i] = "";
              } else {
                infoCorrect = false;
                break;
              }
            }
            if (infoCorrect) {
              Plot.findOneAndUpdate(
                { _id: plot._id },
                { $set: { current_day_schedule: scheduleArray } },
                { returnOriginal: false },
                (err_plot_updating, plotNew) => {
                  if (!err_plot_updating) {
                    Transaction.findOneAndUpdate(
                      { _id: transaction_id },
                      { cancelled: true },
                      (err_update_transaction, transactionNew) => {
                        if (!err_update_transaction) {
                          User.findByIdAndUpdate(
                            { _id: transactionNew.user_id },
                            { current_transaction: "" },
                            (err, user) => {
                              if (err) {
                                console.log(
                                  "Transaction fault for user:" +
                                    user_id +
                                    " transaction_id: " +
                                    transactionNew._id
                                );
                              } else {
                                return res
                                  .status(200)
                                  .json({ newTransaction: transactionNew });
                              }
                            }
                          );
                        } else {
                          return res.status(400).json({
                            error:
                              "Your reservation is cancelled but transaction is yet to update",
                          });
                        }
                      }
                    );
                  } else {
                    return res.status(400).json({
                      error:
                        "Your reservation is not cancelled.Please try again later",
                    });
                  }
                }
              );
            } else {
              return res
                .status(400)
                .json({ error: "Reservation not cancelled" });
            }
          } else {
            return res.status(400).json({ error: "Reservation not cancelled" });
          }
        });
      }
    }
  );
};
exports.addVehicle = async (req, res) => {
  const user_id = req.user._id;
  const { number } = req.body;
  Vehicle.findOne({ number: number }, (err, vehicle) => {
    if (err) {
      res.status(400).json({
        success: false,
        error: err,
      });
    } else {
      if (vehicle) {
        User.findOneAndUpdate(
          { _id: user_id },
          { $addToSet: { vehicles: vehicle._id } },
          (err, user) => {
            if (err) {
              res.status(400).json({
                success: false,
                error: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: "Vehicle added",
              });
            }
          }
        );
      } else {
        const vehicleNew = new Vehicle({
          number: number,
          user_id: user_id,
        });
        vehicleNew.save((err, newVehicle) => {
          User.findOneAndUpdate(
            { _id: user_id },
            { $addToSet: { vehicles: newVehicle._id } },
            (err, user) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  error: err,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: "Vehicle added",
                });
              }
            }
          );
        });
      }
    }
  });
};
