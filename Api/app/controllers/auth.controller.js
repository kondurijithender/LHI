const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Distributor = db.distributor;
const Route = db.route;
const ApiError = require('../error/ApiError');
const { check, validationResult } = require('express-validator')

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");



exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ error: true, message: "Invalid Username!" });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          error: true,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
};
