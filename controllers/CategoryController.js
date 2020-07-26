import { body, validationResult } from "express-validator";
import apiResponse from "../helpers/apiResponse";
import mongoose from "mongoose";

import Category from "../models/CategoryModel";

mongoose.set("useFindAndModify", false);

// Category Schema
function CategoryData(data) {
  this.id = data._id;
  this.name = data.name;
  this.description = data.description;
  this.parent_id = data.parent_id;
  this.dateAdded = data.dateAdded;
}

exports.categoryDetails = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Category.findOne(
        { _id: req.params.id },
        "_id name description parent_id dateAdded"
      ).then((category) => {
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          category || {}
        );
      });
    } catch (error) {}
  },
];

exports.categoryList = [
  (req, res) => {
    try {
      Category.find({}).then((categories) => {
        categories = categories.length ? categories : [];
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          categories
        );
      });
    } catch (error) {
      return apiResponse.errorResponse(res, error);
    }
  },
];

// name: { type: String, required: true },
// description: { type: String, required: true },
// parent_id: { type: ObjectId, required: false },
// dateAdded: { type: Date, required: true },

exports.categoryStore = [
  body("name", "First name must not be empty").isLength({ min: 5 }).escape(),
  body("description", "Last name must not be empty")
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
      // TODO add validation to parent_id
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        parent_id: req.body.parent_id,
        dateAdded: Date.now(),
      });

      category.save((err) => {
        if (err) {
          return apiResponse.errorResponse(res, err);
        }
        const categoryData = new CategoryData(category);
        return apiResponse.successResponseWithData(
          res,
          "Category added successfully",
          categoryData
        );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.categoryUpdate = [
  body("name", "First name must not be empty").isLength({ min: 5 }).escape(),
  body("description", "Last name must not be empty")
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
      // TODO add validation to parent_id
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        parent_id: req.body.parent_id,
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
      Category.findByIdAndUpdate(req.params.id, category, {}, (err) => {
        return err
          ? apiResponse.errorResponse(res, err)
          : apiResponse.successResponseWithData(
              res,
              "Category updated successfully.",
              category
            );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.categoryDelete = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Category.findById(req.params.id, (err, foundCategory) => {
        if (foundCategory === null) {
          return apiResponse.notFoundResponse(
            res,
            "No category with this ID exists!"
          );
        }
        // Check authorized category
        Category.findByIdAndRemove(req.params.id, (err) => {
          return err
            ? apiResponse.ErrorResponse(res, err)
            : apiResponse.successResponse(
                res,
                "Category deleted Successfully."
              );
        });
      });
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
