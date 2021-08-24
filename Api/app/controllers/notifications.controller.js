const db = require("../models");
const Notification = db.notification;
var moment = require('moment');

exports.create = async (title, body) => {
  const notification = new Notification({
    distributorId,
    title,
    body,
    date: moment.now()
  });

  notification.save((err, user) => {
    if (err) console.log('notifications error', err);
    return true;
  });

};

exports.getAll = (req, res) => {
  const { distributorId, limit } = req.body;
  if (limit > 0) {
    Notification.find({ distributorId: distributorId }, (err, notifications) => {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      }
      res.status(200).send({
        notifications,
      });
    }).sort({ date: -1 }).limit(limit).skip(0);
  } else {
    Notification.aggregate(
      [
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            records: { $push: "$$ROOT" }
          }
        },
        {
          $sort: { "_id": -1 }
        }
      ],
      function (err, notifications) {
        if (err) {
          res.status(500).send({ error: true, message: err });
          return;
        } else {
          res.status(200).send({
            notifications,
          });
        }
      }
    );
  }
};
exports.update = async (req, res, next) => {
  const { distributorId } = req.body
  Notification.updateMany({ distributorId: distributorId }, { "$set": { isRead: true } }).exec(function (err, book) {
    if (err) {
      if (err) res.status(500).send({ error: true, message: err });
    } else {
      res.send({ message: "Notifications was updated successfully!" });
    }
  });

};