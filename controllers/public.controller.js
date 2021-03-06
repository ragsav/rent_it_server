const City = require("../models/city.model");
const Lot = require("../models/lot.model");
const Plot = require("../models/plot.model");
const Area = require("../models/area.model");

exports.getCityController = async (req, res) => {
  City.find((err, docs) => {
    if (!err) {
      res.status(200).send({ cities: docs });
    } else {
      res.status(400).send({ error: err });
    }
  });
};

exports.getLotController = async (req, res) => {
  const city_id = req.params.city_id;
  const area_id = req.params.area_id;
  if (area_id === "SEND_ALL") {
    Lot.find({ city_id: city_id })
      .sort({ _id: "asc" })
      .exec((err, lots) => {
        if (!err) {
          return res.status(200).send({
            lots,
          });
        } else {
          console.log(err);
          return res.status(400).send({
            error: err,
          });
        }
      });
  } else {
    Lot.find(
      { city_id: city_id, area_id: area_id },
      " -active_plots_list -passive_plots_list"
    )
      .sort({ _id: "asc" })
      .exec((err, lots) => {
        if (!err) {
          return res.status(200).send({
            lots,
          });
        } else {
          return res.status(400).send({
            error: err,
          });
        }
      });
  }
};

exports.getLotWithoutImagesController = async (req, res) => {
  const city_id = req.params.city_id;
  const area_id = req.params.area_id;
  if (area_id === "SEND_ALL") {
    Lot.find(
      { city_id: city_id },
      " -cover_image -active_plots_list -passive_plots_list"
    )
      .sort({ _id: "asc" })
      .exec((err, lots) => {
        if (!err) {
          return res.status(200).send({
            lots,
          });
        } else {
          console.log(err);
          return res.status(400).send({
            error: err,
          });
        }
      });
  } else {
    Lot.find(
      { city_id: city_id, area_id: area_id },
      " -cover_image -active_plots_list -passive_plots_list"
    )
      .sort({ _id: "asc" })
      .exec((err, lots) => {
        if (!err) {
          return res.status(200).send({
            lots,
          });
        } else {
          return res.status(400).send({
            error: err,
          });
        }
      });
  }
};

exports.getLotById = async (req, res) => {
  const city_id = req.params.city_id;
  const area_id = req.params.area_id;
  const lot_id = req.params.lot_id;

  Lot.findOne(
    { city_id: city_id, area_id: area_id, _id: lot_id },
    "-active_plots_list -passive_plots_list",
    (err, lot) => {
      if (!err) {
        return res.status(200).send({
          lot,
        });
      } else {
        return res.status(400).send({
          error: err,
        });
      }
    }
  );
};

exports.getAreaController = async (req, res) => {
  const city_id = req.params.city_id;
  console.log(city_id);
  Area.find({ city_id: city_id }, (err, areas) => {
    if (!err) {
      res.status(200).send({ areas });
    } else {
      res.status(400).send({
        error: err,
      });
    }
  });
};
exports.getSearchResult = async (req, res) => {
  const text = req.params.text;
  console.log(text);
  const city_id = req.params.city_id;
  if (text === "SEND_ALL" || text == "" || text == null || text == "-") {
    Lot.find(
      { city_id: city_id },
      " -cover_image -active_plots_list -passive_plots_list",
      (err, lots) => {
        if (!err) {
          return res.status(200).send({
            lots,
          });
        } else {
          return res.status(400).send({
            error: err,
          });
        }
      }
    );
  } else {
    Lot.find(
      {
        $or: [
          { name: new RegExp(text, "i"), city_id: city_id },
          { area_name: new RegExp(text, "i"), city_id: city_id },
        ],
      },
      " -cover_image -active_plots_list -passive_plots_list",
      (err, lots) => {
        if (!err) {
          return res.status(200).send({
            lots,
          });
        } else {
          return res.status(400).send({
            error: err,
          });
        }
      }
    );
  }
};
