import { body, validationResult } from "express-validator";
import apiResponse from "../helpers/apiResponse";
import mongoose from "mongoose";

import Product from "../models/ProductModel";

mongoose.set("useFindAndModify", false);

// Product Schema
function ProductData(data) {
  this.id = data._id;
  this.name = data.name;
  this.description = data.description;
  this.price = data.price;
  this.category_id = data.category_id;
  this.makes = data.makes;
  this.quantity = data.quantity;
  this.images = data.images;
  this.dateAdded = data.dateAdded;
}

//TODO
// find by name
// find by category_id
// sort by
// add images

exports.productDetails = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Product.findOne(
        { _id: req.params.id },
        "_id name description category_id makes quantity images  comments dateAdded"
      ).then((product) => {
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          product || {}
        );
      });
    } catch (error) {}
  },
];

exports.productList = [
  (req, res) => {
    const sort = req.query.sort || "";
    let searchObj = {};
    if (req.query.filterBy) {
      searchObj = {
        $or: [
          { name: { $regex: `.*${req.query.filterBy}.*`, $options: "i" } },
          {
            description: { $regex: `.*${req.query.filterBy}.*`, $options: "i" },
          },
        ],
      };
    }
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 10;

    try {
      Product.find(searchObj)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .then((products) => {
          products = products.length ? products : [];
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            products
          );
        });
    } catch (error) {
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.productStore = [
  body("name", "Name must not be empty").isLength({ min: 5 }).escape(),
  body("description", "Description must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("category_id", "Email name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      }
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        category_id: req.body.category_id,
        makes: req.body.makes,
        price: req.body.price,
        quantity: req.body.quantity,
        images: req.body.images,
        dateAdded: Date.now(),
      });

      product.save((err) => {
        if (err) {
          return apiResponse.errorResponse(res, err);
        }
        const productData = new ProductData(product);
        return apiResponse.successResponseWithData(
          res,
          "Product added successfully",
          productData
        );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.productUpdate = [
  body("name", "First name must not be empty").isLength({ min: 5 }).escape(),
  body("description", "Last name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("category_id", "Email name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      }
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        category_id: req.body.category_id,
        makes: req.body.makes,
        quantity: req.body.quantity,
        images: req.body.images,
        dateAdded: Date.now(),
        _id: req.params.id,
      });

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(
          res,
          "Invalid Error.",
          "Invalid ID"
        );
      }
      Product.findByIdAndUpdate(req.params.id, product, {}, (err) => {
        return err
          ? apiResponse.errorResponse(res, err)
          : apiResponse.successResponseWithData(
              res,
              "Product updated successfully.",
              product
            );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.productDelete = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Product.findById(req.params.id, (err, foundProduct) => {
        if (foundProduct === null) {
          return apiResponse.notFoundResponse(
            res,
            "No product with this ID exists!"
          );
        }
        // Check authorized product
        Product.findByIdAndRemove(req.params.id, (err) => {
          return err
            ? apiResponse.ErrorResponse(res, err)
            : apiResponse.successResponse(res, "Product deleted Successfully.");
        });
      });
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
