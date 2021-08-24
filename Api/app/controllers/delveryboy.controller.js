const db = require("../models");
const Order = db.order;
const Route = db.route;
const Distributor = db.distributor;



exports.getAll = async (req, res) => {
  Order.aggregate(
    [
      {
        $group: {
          _id: { distributorId: "$distributorId", routeId: "$routeId", orderType: "$orderType" },
          count: { "$sum": 1 },
        }
      },
      { $lookup: { from: "distributors", localField: "_id.distributorId", foreignField: "_id", as: "distributors" } },
    ],
    function (err, list) {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      } else {
        const orders = list.filter(res => {
          return res._id.routeId == req.params.id;
        });
        res.status(200).send({
          orders,
        });
      }
    }
  );
};
exports.distributorOrder = async (req, res) => {
  const distributor = await Distributor.findById(req.params.id).populate("brand", "-__v");
  // validate
  if (!distributor) res.status(400).send({ error: true, message: 'Distributor not found' });
  else {
    const orders = await Order.find({ distributorId: req.params.id }).populate({
      path: 'product',
      populate: {
        path: 'productId'
      }
    });
    res.status(200).send({
      orders,
      distributor
    });
  }
}





