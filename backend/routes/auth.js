const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/user", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token not found!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);

    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in." });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    return res.status(401).json({
      message: "Invalid or expired token. Please log in with Google.",
    });
  }
});

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const client = process.env.CLIENT_URL;

    res.redirect(`${client}/dashboard`);
  }
);

module.exports = router;
