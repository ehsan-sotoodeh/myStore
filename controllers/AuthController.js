const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/UserModel");
import apiResponse from "../helpers/apiResponse";
import mongoose from "mongoose";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

mongoose.set("useFindAndModify", false);

//Create a passport middleware to handle user registration
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      failureRedirect: "/failurejson",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const dateAdded = Date.now();
        const hash = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
          email,
          password: hash,
          firstName,
          lastName,
          dateAdded,
        });
        //Send the user information to the next middleware
        user.password = "*********";
        req.user = user;
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

exports.authSignupMiddleware = (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user) => {
    if (!user) {
      return apiResponse.validationError(res, String(err));
    }
    next();
  })(req, res, next);
};

//Create a passport middleware to handle User login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        //Find the user associated with the email provided by the user
        const user = await UserModel.findOne({ email });
        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        //Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

exports.authLoginMiddleware = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return apiResponse.unauthorizedResponse(
          res,
          err || "Incorrect Username or Password"
        );
        //return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, "top_secret");
        //Send back the token to the user
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

//This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: "top_secret",
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

exports.authenticationMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user) {
      return apiResponse.unauthorizedResponse(res, String(info));
    }
    next();
  })(req, res, next);
};

exports.signupValidationMiddleware = [
  (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    let errors = [
      checkValid(firstName, "First Name"),
      checkValid(lastName, "Last Name"),
      checkValid(email, "Email"),
      checkValid(password, "Password"),
    ];
    errors = errors.filter((e) => e !== null);
    if (errors.length) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error.",
        errors
      );
    }
    next();
  },
];

const checkValid = (input, message) => {
  return !input || input.length <= 4
    ? message + " must be at least 5 character"
    : null;
};
