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

      let role = 'admin';

      for (let i = 0; i < user.roles.length; i++) {
        role = user.roles[i].name;
      }
      console.log(user);
      res.status(200).send({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role,
        accessToken: token
      });
    });
};
exports.appSignin = async (req, res, next) => {
  await check('username').notEmpty().withMessage('Distributor userid is required').run(req);
  await check('password').notEmpty().withMessage('Password is required').run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  let appData = {};
  let deliveryBoy = null;
  const distributor = await Distributor.findOne({ code: req.body.username });
  let role = null;
  if (!distributor) {
    deliveryBoy = await Route.findOne({ code: req.body.username });
    appData = deliveryBoy;
    role
    role = 'deliveryBoy';
  } else {
    appData = distributor;
    role = 'distributor';
  }
  if (!distributor && !deliveryBoy) res.status(500).json({ error: true, message: "User code is invalid." });
  else {
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      appData.passwordHash
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        error: true,
        message: "Invalid Password!"
      });
    }
    let token = jwt.sign({ user: appData, role }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
    res.status(200).send({
      _id: appData._id,
      accessToken: token,
      role
    });
  }

};

exports.appChangePassword = async (req, res, next) => {
  await check('username').notEmpty().withMessage('Distributor userid is required').run(req);
  await check('newPassword').notEmpty().withMessage('Password is required').run(req);
  const { username, newPassword } = req.body
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  Distributor.findOne({
    _id: username
  })
    .exec((err, distributor) => {
      if (err) res.send({ error: false, message: err });
      if (!distributor) res.status(500).json({ error: true, message: "Distributor userid is invalid." });
      else {
        bcrypt.genSalt(10, function (err, salt) {
          // Call error-handling middleware:
          if (err) { return res.send({ error: true, message: err }); }
          bcrypt.hash(newPassword, salt, function (err, hash) {
            distributor.password = newPassword;
            distributor.passwordHash = hash;
            distributor.passwordChanged = true;
            distributor.save((err, product) => {
              if (err) res.status(500).send({ error: true, message: err });
              res.send({ status: 200, message: "Password is updated successfully!" });
            });
          })
        })
      }
    });
};
