const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/auth");
const { validateProfileFields } = require("../utils/vaildation");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// GET: get profile
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ user, message: "Profile fetched successfully", status: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH: update profile
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileFields(req)) {
      throw new Error("Fields are not valid");
    }
    const user = req.user;
    Object.keys(req.body).forEach((field) => (user[field] = req.body[field]));
    user.save();
    res.send({ user, message: "Profile updated successfully", status: 200 });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password should be strong. Your password should be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character"
      );
    }
    const user = req.user;
    user.password = await bcrypt.hash(password, 10);
    user.save();
    res.send({ message: "Password updated successfully", status: 200 });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
