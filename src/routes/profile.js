const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/auth");
const { validateProfileFields } = require("../utils/vaildation");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
// GET: get profile
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ user, message: "Profile fetched successfully", status: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

profileRouter.get("/view/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !validator.isMongoId(userId)) {
      return res.status(400).send({ message: "Invalid userId" });
    }

    if (req.user._id.toString() === userId) {
      return res.send({
        user: req.user,
        message: "Profile fetched successfully",
        status: 200,
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

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
    await user.save();
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    res.send({
      user: userObj,
      message: "Profile updated successfully",
      status: 200,
    });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password should be strong. It should contain at least 8 characters , one lowercase letter, one uppercase letter, one number and one special character"
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
