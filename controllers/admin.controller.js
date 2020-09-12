const City = require("../models/city.model");
const Lot = require("../models/lot.model");
const Plot = require("../models/plot.model");
const Area = require("../models/area.model");

exports.makeCityController = async (req, res) => {
  const { name } = req.body;
  const city = new City({
    name,
  });
  await city.save((err, cityNew) => {
    return res.status(200).send(cityNew);
  });
};
exports.makeLotController = async (req, res) => {
  const { name, open_time, close_time, city_id, area_id } = req.body;
  const lot = new Lot({
    name,
    open_time,
    close_time,
    city_id,
    area_id,
  });
  //   const city = await City.findOne({_id:city_id});
  //   const area = await Area.findOne({_id:area_id});

  await lot.save((err, lotNew) => {
    if (!err) {
      City.findOneAndUpdate(
        { _id: city_id },
        { $addToSet: { lot_list: lotNew._id } },
        (err, city) => {
          if (!err) {
            Area.findByIdAndUpdate(
              { _id: area_id },
              { $addToSet: { lot_list: lotNew._id } },
              (err, area) => {
                if (!err) {
                  res.status(200).send({
                    city: city,
                    area,
                    area,
                    lotNew: lotNew,
                  });
                } else {
                  return res.status(400).send(err);
                }
              }
            );
          } else {
            return res.status(400).send(err);
          }
        }
      );
    } else {
      return res.status(400).send(err);
    }
  });
};
exports.makePlotController = async (req, res) => {
  var { number, lot_id } = req.body;
  var plot = new Plot({
    number: number,
    lot_id: lot_id,
  });
  await plot.save(async (err, doc) => {
    if (!err) {
      await Lot.findOneAndUpdate(
        { _id: lot_id },
        { $addToSet: { active_plots_list: doc._id } },
        (err1, doc1) => {
          if (!err) {
            return res.status(200).send(doc1);
          } else {
            Plot.findOneAndDelete({ _id: doc._id });
            return res.status(400).send(err1);
          }
        }
      );
    } else {
      return res.status(400).send(err);
    }
  });
};
exports.makeAreaController = async (req, res) => {
  var { name, city_id, distance } = req.body;
  const area = new Area({
    name,
    city_id,
    distance,
  });
  await area.save((err, areaNew) => {
    if (!err) {
      City.findByIdAndUpdate(
        { _id: city_id },
        { $addToSet: { area_list: areaNew._id } },
        (err, doc) => {
          if (!err) {
            res.status(200).send(doc);
          } else {
            Area.findOneAndDelete({ _id: areaNew._id });
            return res.status(400).send({
              err,
            });
          }
        }
      );
    } else {
      res.status(400).send(err);
    }
  });
};
exports.modifyPlots = async (req, res) => {
  Plot.updateMany(
    {},
    { $set: { type: Math.floor(Math.random() * 10) % 3 } },
    { upsert: false, multi: true },
    (err, docs) => {
      console.log(docs);
      return res.send(err);
    }
  );
};
