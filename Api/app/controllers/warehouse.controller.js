const db = require("../models");
const Warehouse = db.warehouse;
const ApiError = require('../error/ApiError');

exports.create = (req, res, next) => {
  const { name, code } = req.body
  if (!name) {
    res.status(500).send({ error: true, message: 'name is required' });
  }
  const warehouse = new Warehouse({
    name,
    code
  });

  warehouse.save((err, user) => {
    if (err) res.status(500).send({ error: true,  message: err });
    res.send({ status: 200, message: "Warehouse was created successfully!" });
  });

};

exports.getAll = (req, res) => {
  Warehouse.find((err, warehouses) => {
    if (err) {
      res.status(500).send({ error: true, message: err });
      return;
    }
    res.status(200).send({
      warehouses,
    });
  });
};

exports.delete = async (req, res, next) => {
  const warehouse = await Warehouse.findById(req.params.id);
  // validate
  if (!warehouse) res.status(500).send({ error: true, message: 'Warehouse not found' });

  Warehouse.findByIdAndRemove(warehouse._id, (err, product) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Warehouse was deleted successfully!" });
  });
}



