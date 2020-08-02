import experss from "express";
import {
  signupValidationMiddleware,
  authSignupMiddleware,
  authLoginMiddleware,
} from "../controllers/AuthController";
const passport = require("passport");

const router = experss.Router();
router.post(
  "/signup",
  signupValidationMiddleware,
  authSignupMiddleware,
  async (req, res, next) => {
    res.json({
      status: 1,
      message: "Signup successful",
      data: req.user,
    });
  }
);

router.post("/login", authLoginMiddleware);

module.exports = router;
