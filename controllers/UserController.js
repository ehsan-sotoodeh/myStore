import { body, validationResult } from "express-validator";
import apiResponse from "../helpers/apiResponse";
import mongoose from "mongoose";

import User from "../models/UserModel";

mongoose.set("useFindAndModify", false);

// User Schema
function UserData(data) {
  this.id = data._id;
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.email = data.email;
  this.password = data.password;
  this.isAdmin = data.isAdmin;
  this.address = data.address;
  this.favories = data.favories;
  this.dateAdded = data.dateAdded;
}

exports.userDetails = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      User.findOne(
        { _id: req.params.id },
        "_id firstName lastName email isAdmin address favories dateAdded"
      ).then((user) => {
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          user || {}
        );
      });
    } catch (error) {}
  },
];

exports.userList = [
  (req, res) => {
    try {
      User.find({}).then((users) => {
        users = users.length ? users : [];
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          users
        );
      });
    } catch (error) {
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.userStore = [
  body("firstName", "First name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("lastName", "Last name must not be empty").isLength({ min: 5 }).escape(),
  body("email", "Email name must not be empty").isLength({ min: 5 }).escape(),
  body("address", "Address  must not be empty").isLength({ min: 5 }).escape(),
  body("password", "Password  must not be empty").isLength({ min: 5 }).escape(),
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
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password, //TODO don't save plain passsword
        isAdmin: req.body.isAdmin,
        address: req.body.address,
        dateAdded: Date.now(),
      });

      user.save((err) => {
        if (err) {
          return apiResponse.errorResponse(res, err);
        }
        const userData = new UserData(user);
        return apiResponse.successResponseWithData(
          res,
          "User added successfully",
          userData
        );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.userUpdate = [
  body("firstName", "First name must not be empty")
    .isLength({ min: 5 })
    .escape(),
  body("lastName", "Last name must not be empty").isLength({ min: 5 }).escape(),
  body("email", "Email name must not be empty").isLength({ min: 5 }).escape(),
  body("address", "Address  must not be empty").isLength({ min: 5 }).escape(),
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
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
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
      // check if user is authorized to update
      User.findByIdAndUpdate(req.params.id, user, {}, (err) => {
        return err
          ? apiResponse.errorResponse(res, err)
          : apiResponse.successResponseWithData(
              res,
              "User updated successfully.",
              user
            );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.userDelete = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      User.findById(req.params.id, (err, foundUser) => {
        if (foundUser === null) {
          return apiResponse.notFoundResponse(
            res,
            "No user with this ID exists!"
          );
        }
        // Check authorized user
        User.findByIdAndRemove(req.params.id, (err) => {
          return err
            ? apiResponse.ErrorResponse(res, err)
            : apiResponse.successResponse(res, "User deleted Successfully.");
        });
      });
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
