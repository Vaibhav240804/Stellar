const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const User = require("../models/user");
dotenv.config();

class UserController {
  constructor() {}

  generateOTP() {
    return crypto.randomInt(100000, 999999);
  }

  sendEmail = async (email, otp) => {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let mailOptions = {
        from: `<${process.env.MAIL}>`,
        to: email,
        subject: "OTP for Verification",
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2 style="color: #4CAF50;">Your OTP for Verification</h2>
        <p style="font-size: 16px;">Your OTP for verification is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
        <p style="font-size: 14px; color: #777;">Please use this OTP to complete your verification process.</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  };

  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      console.log(email, otp);
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(otp);

      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      console.log("OTP verified successfully");

      user.otp = "";
      await user.save();
      const JWT_SECRET = process.env.JWT_SECRET;

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 12 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.json({
        message: "OTP verified successfully",
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  signup = async (req, res) => {
    try {
      const { name, password, email } = req.body;
      console.log(req.body);
      const alreadyExists = await User.findOne({ email });
      if (alreadyExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        name,
        email,
        password,
      });

      await newUser.save();
      res.status(200).json({
        message: "User registered successfully,\nNow proceed to login!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  signin = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        console.log(isValid);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const otp = this.generateOTP();
      user.otp = otp;
      await user.save();
      await this.sendEmail(user.email, otp);

      res.json({
        message: "Login successful, OTP sent to email",
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  };
}

module.exports = new UserController();
