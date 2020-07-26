import { body, validationResult } from "express-validator";
import Client from "../models/ClientModel";
import apiResponse from "../helpers/apiResponse";
import mongoose from "mongoose";
mongoose.set("useFindAndModify", false);

// Client Schema
function ClientData(data) {
  this.id = data._id;
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.address = data.address;
  this.phoneNumber = data.phoneNumber;
  this.assignedLawyer = data.assignedLawyer;
  this.notes = data.notes;
  this.dateAdded = data.dateAdded;
}

exports.clientDetails = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Client.findOne(
        { _id: req.params.id },
        "_id firstName lastName address phoneNumber assignedLawyer notes dateAdded"
      ).then((client) => {
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          client || {}
        );
      });
    } catch (error) {}
  },
];

exports.clientList = [
  (req, res) => {
    try {
      Client.find({}).then((clients) => {
        clients = clients.length ? clients : [];
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          clients
        );
      });
    } catch (error) {
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.clientStore = [
  body("firstName", "First name must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "First name must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("address", "First name must not be empty").isLength({ min: 1 }).escape(),
  body("phoneNumber", "First name must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("lawerLicenseId", "First name must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("lawerName", "First name must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("lawerLastName", "First name must not be empty")
    .isLength({ min: 1 })
    .escape(),
  body("notes", "First name must not be empty").isLength({ min: 1 }).escape(),
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
      const client = new Client({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        assignedLawyer: {
          lawerLicenseId: req.body.lawerLicenseId,
          lawerName: req.body.lawerName,
          lawerLastName: req.body.lawerLastName,
        },
        notes: req.body.notes,
        dateAdded: Date.now(),
      });

      client.save((err) => {
        if (err) {
          return apiResponse.errorResponse(res, err);
        }
        const clientData = new ClientData(client);
        return apiResponse.successResponseWithData(
          res,
          "Client added successfully",
          clientData
        );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.clientUpdate = [
  body("firstName", "First name must not be empty").isLength({ min: 1 }),
  body("lastName", "First name must not be empty").isLength({ min: 1 }),
  body("address", "First name must not be empty").isLength({ min: 1 }),
  body("phoneNumber", "First name must not be empty").isLength({ min: 1 }),
  body("lawerLicenseId", "First name must not be empty").isLength({ min: 1 }),
  body("lawerName", "First name must not be empty").isLength({ min: 1 }),
  body("lawerLastName", "First name must not be empty").isLength({ min: 1 }),
  body("notes", "First name must not be empty").isLength({ min: 1 }),
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
      const client = new Client({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        assignedLawyer: {
          lawerLicenseId: req.body.lawerLicenseId,
          lawerName: req.body.lawerName,
          lawerLastName: req.body.lawerLastName,
        },
        notes: req.body.notes,
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
      Client.findByIdAndUpdate(req.params.id, client, {}, (err) => {
        return err
          ? apiResponse.errorResponse(res, err)
          : apiResponse.successResponseWithData(
              res,
              "Client updated successfully.",
              client
            );
      });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  },
];

exports.clientDelete = [
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid Error.",
        "Invalid ID"
      );
    }
    try {
      Client.findById(req.params.id, (err, foundClient) => {
        if (foundClient === null) {
          return apiResponse.notFoundResponse(
            res,
            "No client with this ID exists!"
          );
        }
        // Check authorized user
        Client.findByIdAndRemove(req.params.id, (err) => {
          return err
            ? apiResponse.ErrorResponse(res, err)
            : apiResponse.successResponse(res, "Client deleted Successfully.");
        });
      });
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
