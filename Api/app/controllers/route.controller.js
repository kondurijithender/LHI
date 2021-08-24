const db = require("../models");
const Route = db.route;
const Warehouse = db.warehouse;
const ApiError = require('../error/ApiError');
const { validationResult } = require('express-validator');
var bcrypt = require("bcryptjs");

exports.create = (req, res, next) => {
  const { name, warehouse, openTime, closeTime, locations, code, password } = req.body
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() })
  }

  const route = new Route({
    name,
    warehouse,
    openTime,
    closeTime,
    locations,
    code,
    password,
    passwordHash: bcrypt.hashSync(password, 8)
  });

  route.save((err, user) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "route was created successfully!" });
  });

};

exports.update = async (req, res, next) => {
  const { openTime, closeTime, locations, code, password } = req.body
  const route = await Route.findById(req.params.id);
  // validate
  if (!route) res.status(400).send({ error: true, message: 'Route not found' });
  route.openTime = openTime;
  route.closeTime = closeTime;
  route.locations = locations;
  route.code = code ? code : route.code;
  route.password = password ? password : route.password;
  route.passwordHash = password ? bcrypt.hashSync(password, 8) : route.passwordHash;

  route.save((err, product) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Route was updated successfully!" });
  });
};
exports.delete = async (req, res, next) => {
  const route = await Route.findById(req.params.id);
  // validate
  if (!route) res.status(500).send({ error: true, message: 'Route not found' });

  Route.findByIdAndRemove(route._id, (err, product) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Route was deleted successfully!" });
  });
}
exports.getById = async (req, res, next) => {
  const route = await Route.findById(req.params.id);
  // validate
  if (!route) res.status(400).send({ error: true, message: 'Route not found' });
  res.send({ route });
};
exports.getAll = async (req, res) => {
  const warehouse = await Warehouse.findById(req.query.warehouse);
  // validate
  if (!warehouse) res.status(400).send({ error: true, message: 'Warehouse not found' });
  else {
    Route.find({ warehouse: req.query.warehouse }, (err, routes) => {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      }
      res.status(200).send({
        routes,
      });
    });
  }
};



