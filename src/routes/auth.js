const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const validateData = require("../utils/vaildation");
const validator = require("validator");

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

    await user.save();
    res.send("User saved successfully");
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
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    //create a jwt token
    const token = user.getJWT();
    res.cookie("token", token, { maxAge: 86400000 });
    res.send("User logged in successfully ");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = authRouter;
