const express = require("express");
const router = express.Router();
const { verifyOtp, signin, signup, logout } = require("../controllers/2FALogIn");
const { validate } = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");

router.post(
  "/signup",
  validate([
    check("email").notEmpty().trim().isEmail().withMessage("Invalid Email"),
    check("name")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long")
      .escape(),
    check("password")
      .notEmpty()
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long")
      .escape(),
  ]),
  signup
);

router.post(
  "/signin",
  validate([
    check("email").notEmpty().trim().isEmail().withMessage("Invalid Email"),
    check("password")
      .notEmpty()
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long")
      .escape(),
  ]),
  signin
);

router.post(
  "/verify",
  validate([
    check("otp")
      .notEmpty()
      .trim()
      .isNumeric()
      .isLength({ min: 6, max: 6 })
      .withMessage("Invalid OTP"),
    check("email").notEmpty().trim().isEmail().withMessage("Invalid Email"),
  ]),
  verifyOtp
);

router.get("/logout", 
  logout
);

module.exports = router;
