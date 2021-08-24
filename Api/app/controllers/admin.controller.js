const db = require("../models");
const User = db.user;
const { check, validationResult } = require('express-validator')
var _ = require('lodash');
var bcrypt = require("bcryptjs");

exports.create = async (req, res, next) => {
  await check('name').notEmpty().withMessage('Name is required').run(req);
  await check('username').notEmpty().withMessage('User name is required').run(req);
  await check('email').notEmpty().withMessage('Email is required').run(req);
  await check('password').notEmpty().withMessage('Password is required').run(req);
  await check('brandId').notEmpty().withMessage('Brand Id is required').run(req);
  const { name, username, email, password, brandId } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() })
  }

  const user = new User({
    name,
    username,
    email,
    password,
    brandId
  });
  bcrypt.genSalt(10, function (err, salt) {
    // Call error-handling middleware:
    if (err) { return res.send({ error: true, message: err }); }
    bcrypt.hash(password, salt, function (err, hash) {
      new User({
        name,
        username,
        email,
        password: hash,
        brandId
      }).save(err => {
        if (err) res.status(500).send({ error: true, message: err });
        res.send({ message: "Brand Admin was created successfully!" });
      })
    });
  })


};

exports.update = async (req, res, next) => {
  await check('name').notEmpty().withMessage('Name is required').run(req);
  await check('email').notEmpty().withMessage('Email is required').run(req);
  await check('password').notEmpty().withMessage('Password is required').run(req);
  await check('brandId').notEmpty().withMessage('Brand Id is required').run(req);

  const { name, username, email, password, brandId } = req.body

  const user = await User.findById(req.params.id);
  // validate
  if (!user) res.status(400).send({ error: true, message: 'User not found' });
  bcrypt.genSalt(10, function (err, salt) {
    // Call error-handling middleware:
    if (err) { return res.send({ error: true, message: err }); }
    bcrypt.hash(password, salt, function (err, hash) {
      user.name = name;
      user.username = username;
      user.email = email;
      user.password = password.length ? hash : user.password;
      user.brandId = brandId;

      user.save(err => {
        if (err) res.status(500).send({ error: true, message: err });
        res.send({ message: "Brand Admin was updated successfully!" });
      })
    });
  })
};

exports.delete = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // validate
  if (!user) res.status(500).send({ error: true, message: 'User not found' });

  User.findByIdAndRemove(user._id, (err, user) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "User was deleted successfully!" });
  });
}
exports.getById = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // validate
  if (!user) res.status(400).send({ error: true, message: 'User not found' });
  res.send({ user });
};
exports.getAll = (req, res) => {
  User.find({ brandId: { $exists: true } })
    .populate('brandId', 'name')
    .exec((err, users) => {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      }
      res.status(200).send({
        users,
      });
    });
};



