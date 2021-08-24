const db = require("../models");
const Product = db.product;
const fs = require('fs');
const path = require('path');
const ApiError = require('../error/ApiError');
const { check, validationResult } = require('express-validator')

exports.create = async (req, res, next) => {
  
  await check('name').notEmpty().withMessage('Product name is required').run(req);
  await check('packet').notEmpty().withMessage('Packet count is required').run(req);
  await check('brandId').notEmpty().withMessage('Brand Id is required').run(req);
  if (!req.files) {
    res.send({ status: 400, message: 'Product image is required' });
  }
  
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({  error: true, message: result.array() });
  } else {
  const { name, packet } = req.body
  let image = req.files.image;
  let extension = path.extname(image.name)
  // Checking File Size (Max Size - 1MB)
  if (image.size > 1048576) {

    // Deleting Temporary File
    fs.unlinkSync(image.tempFilePath);
    return res.status(431).send({  error: true,  message: 'File is too Large' });
  }

  let file = `${image.md5}${extension}`;
  image.mv(`public/uploads/${file}`, (err) => {
    if (err) res.status(500).send({ error: true, message: err });
    
    const product = new Product({
      brandId: req.body.brandId,
      name: req.body.name,
      fileName: file,
      packet: req.body.packet,
      fileOriginalName: image.name
    });

    product.save((err, user) => {
      if (err) return res.status(500).send({ error: true, message: err });
      return  res.send({message: "Product was created successfully!" });
    });
  });
}
};

exports.update = async (req, res, next) => {
  await check('name').notEmpty().withMessage('Product name is required').run(req);
  await check('packet').notEmpty().withMessage('Packet count is required').run(req);
  
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: true, message: result.array() });
  }
  const { name, packet } = req.body
  
  const product = await Product.findById(req.params.id);
  // validate
  if (!product) res.status(400).send({ error: true, message: 'Product not found' });
  if (req.files) {
    let file = `public/uploads/${product.fileName}`;
    if (fs.existsSync(file)) {
      fs.unlinkSync(file, (err) => {
        if (err) res.status(500).send({ error: true, message: err });
      });
    }

    let image = req.files.image;
    let extension = path.extname(image.name)
    // Checking File Size (Max Size - 1MB)
    if (image.size > 1048576) {

      // Deleting Temporary File
      fs.unlinkSync(image.tempFilePath);
      res.status(431).send({ error: true, message: 'File is too Large' });
    }
    file = `${image.md5}${extension}`;
    image.mv(`public/uploads/${file}`, (err) => {
      if (err) res.status(500).send({ error: true, message: err });
      product.name = req.body.name;
      product.fileName = file;
      product.fileOriginalName = image.name;
      product.packet = req.body.packet;
      product.status = req.body.status;

      product.save((err, product) => {
        if (err) res.status(500).send({ error: true, message: err });
        res.send({ message: "Product was updated successfully!" });
      });
    });
  } else {
    product.name = req.body.name;
    product.status = req.body.status;
    product.packet = req.body.packet;
    product.save((err, product) => {
      if (err) res.status(500).send({ error: true, message: err });
      res.send({ message: "Product was updated successfully!" });
    });
  }
};
exports.delete = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // validate
  if (!product) res.status(400).send({  error: true, message: 'Product not found' });
  Product.findByIdAndRemove(product._id, (err, product) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Product was deleted successfully!" });
  });
}
exports.getById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // validate
  if (!product) res.status(400).send({ error: true, message: 'Product not found' });
  res.send({ product });
};
exports.getAll = async (req, res) => {
  if (!req.query.brandId) {
    res.send({ status: 400, message: 'BrandId is required' });
  }
  Product.find({ brandId: req.query.brandId }, (err, products) => {
    if (err) {
      res.status(500).send({ error: true, message: err });
      return;
    }
    res.status(200).send({
      products,
    });
  });
};
exports.productStatusChange = async (req, res, next) => {
  const active = req.body.active ? req.body.active : false;
  const product = await Product.findById(req.body.id);
  // validate
  if (!product) res.status(400).send({ error: true, message: "product not found" });
  else {
    Product.findByIdAndUpdate(product._id, { status: active  }, (err, product) => {
      if (err) res.status(500).send({ error: true, message: err });
      res.send({ status: 200, message: "Product status changed successfully!" });
    });
  }
}


