const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const { validateData } = require("../utils/vaildation");
const validator = require("validator");
const generateOTP = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// POST: Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    validateData(req.body);
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const accessToken = savedUser.getAccessToken();
    const refreshToken = savedUser.getRefreshToken();
    const userData = savedUser.toObject();
    delete userData.password;
    res
      .cookie("accessToken", accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Enter Valid Email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    //create a jwt token
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
    const userData = user.toObject();
    delete userData.password;
    res
      .cookie("accessToken", accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Refresh Token
authRouter.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = user.getAccessToken();
    res
      .cookie("accessToken", accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
      })
      .json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

// POST: Logout
authRouter.post("/logout", async (req, res) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .send("User logged out successfully");
});

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Enter Valid Email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const OTP = generateOTP(6);
    await sendEmail(email, OTP);
    const HashedOTP = await bcrypt.hash(OTP, 10);
    const otpToken = jwt.sign(
      { otp: HashedOTP, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    res.cookie("otpToken", otpToken, {
      expires: new Date(Date.now() + 300000),
    });
    res.send("OTP sent successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

authRouter.post("/update-password", async (req, res) => {
  try {
    const { otp, password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password should be strong");
    }
    const otpToken = req.cookies["otpToken"];
    if (!otpToken) {
      throw new Error("OTP expired");
    }
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    const verifyOTP = await bcrypt.compare(otp, decoded.otp);
    if (!verifyOTP) {
      throw new Error("Invalid OTP");
    }
    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.clearCookie("otpToken").send("Password updated successfully");
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = authRouter;
