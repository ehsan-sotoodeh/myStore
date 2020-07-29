import { body, validationResult } from "express-validator";
import apiResponse from "../helpers/apiResponse";
import mongoose from "mongoose";

import Order from "../models/OrderModel";

mongoose.set("useFindAndModify", false);

// Order Schema
function OrderData(data) {
  this.id = data._id;
  this.product_id = data.product_id;
  this.customer_id = data.customer_id;
  this.address = data.address;
  this.quantity = data.quantity;
  this.price = data.price;
  this.make = data.make;
  this.payment_details = data.payment_details;
  this.payment_status = data.payment_status;
  this.delivary_status = data.delivary_status;
  this.tracking_code = data.tracking_code;
  this.order_date = data.order_date;
  this.delivary_date = data.delivary_date;
}

// product_id: { type: mongoose.Types.ObjectId, required: false },
// customer_id: { type: mongoose.Types.ObjectId, required: false },
// address: { type: String, required: true },
// quantity: { type: Number, required: true },
// price: { type: Number, required: true },
// make: { type: Number, required: true },
// payment_details: { type: Mixed, required: true },
// payment_status: { type: String, required: true },
// delivary_status: { type: String, required: true },
// tracking_code: { type: String, required: false },
// order_date: { type: Date, required: true },
// delivary_date: { type: Date, required: false },

exports.orderDetails = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Order.findOne(
        { _id: req.params.id },
        `_id product_id customer_id address quantity price make payment_details
         payment_status delivary_status tracking_code delivary_date  order_date `
      ).then((order) => {
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          order || {}
        );
      });
    } catch (error) {}
  },
];

exports.orderList = [
  (req, res) => {
    try {
      Order.find({}).then((orders) => {
        orders = orders.length ? orders : [];
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          orders
        );
      });
    } catch (error) {
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.orderStore = [
  body("product_id", "First name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("customer_id", "Last name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("address", "Address name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("quantity", "Quantity  must not be empty").isLength({ min: 1 }).escape(),
  body("price", "Price  must not be empty").isLength({ min: 1 }).escape(),
  body("make", "Make  must not be empty").isLength({ min: 1 }).escape(),
  body("payment_details", "Payment details  must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("payment_status", "Payment Status  must not be empty")
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

      const order = new Order({
        product_id: req.body.product_id,
        customer_id: req.body.customer_id,
        address: req.body.address,
        quantity: req.body.quantity,
        price: req.body.price,
        make: req.body.make,
        payment_details: req.body.payment_details, //TODO don't save plain passsword
        payment_status: req.body.payment_status,
        delivary_status: req.body.delivary_status,
        payment_status: req.body.payment_status,
        tracking_code: "AS1#$!w43253werituwp", //Tracking should be generate dynamically
        order_date: Date.now(),
      });

      order.save((err) => {
        if (err) {
          return apiResponse.errorResponse(res, err);
        }
        const orderData = new OrderData(order);
        return apiResponse.successResponseWithData(
          res,
          "Order added successfully",
          orderData
        );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.orderUpdate = [
  body("product_id", "Product id must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("customer_id", "Customer id must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("address", "Address name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("quantity", "Quantity  must not be empty").isLength({ min: 1 }).escape(),
  body("price", "Price  must not be empty").isLength({ min: 1 }).escape(),
  body("make", "Make  must not be empty").isLength({ min: 1 }).escape(),
  body("payment_details", "Payment details  must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("payment_status", "Payment Status  must not be empty")
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
      const order = new Order({
        product_id: req.body.product_id,
        customer_id: req.body.customer_id,
        address: req.body.address,
        quantity: req.body.quantity,
        price: req.body.price,
        make: req.body.make,
        payment_details: req.body.payment_details, //TODO don't save plain passsword
        payment_status: req.body.payment_status,
        delivary_status: req.body.delivary_status,
        payment_status: req.body.payment_status,
        tracking_code: "AS1#$!w43253werituwp", //Tracking should be generate dynamically
        order_date: Date.now(),
        _id: req.params.id,
      });

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(
          res,
          "Invalid Error.",
          "Invalid ID"
        );
      }
      // check if order is authorized to update
      Order.findByIdAndUpdate(req.params.id, order, {}, (err) => {
        return err
          ? apiResponse.errorResponse(res, err)
          : apiResponse.successResponseWithData(
              res,
              "Order updated successfully.",
              order
            );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.orderDelete = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Order.findById(req.params.id, (err, foundOrder) => {
        if (foundOrder === null) {
          return apiResponse.notFoundResponse(
            res,
            "No order with this ID exists!"
          );
        }
        // Check authorized order
        Order.findByIdAndRemove(req.params.id, (err) => {
          return err
            ? apiResponse.ErrorResponse(res, err)
            : apiResponse.successResponse(res, "Order deleted Successfully.");
        });
      });
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
