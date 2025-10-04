const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/auth");
const { validateProfileFields } = require("../utils/vaildation");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const BlockedUser = require("../Models/BlockedUser");
const uploadProfileImageCloudinary = require("../config/cloudinary");
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

profileRouter.post("/block-user/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !validator.isMongoId(userId)) {
      return res.status(400).send({ message: "Invalid userId" });
    }

    const isUserIdExist = await User.findById(userId);
    if (!isUserIdExist) {
      return res.status(404).send({ message: "User not found" });
    }

    const blockedUser = new BlockedUser({
      blockedUserId: userId,
      blockedByUserId: req.user._id,
    });
    await blockedUser.save();
    res.send({ message: "User blocked successfully", status: 200 });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

profileRouter.delete("/unblock-user/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !validator.isMongoId(userId)) {
      return res.status(400).send({ message: "Invalid userId" });
    }
    const isUserIdExist = await User.findById(userId);
    if (!isUserIdExist) {
      return res.status(404).send({ message: "User not found" });
    }
    const unblockedUser = await BlockedUser.findOneAndDelete({
      blockedUserId: userId,
      blockedByUserId: req.user._id,
    });
    if (!unblockedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User unblocked successfully", status: 200 });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

// DELETE: delete profile
profileRouter.delete("/delete", userAuth, async (req, res) => {
  try {
    const user = req.user;
    await User.findByIdAndDelete(user._id);
    res.send({ message: "Profile deleted successfully", status: 200 });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

profileRouter.post(
  "/upload-profile-image",
  userAuth,
  uploadProfileImageCloudinary.single("ProfileImage"),
  async (req, res, next) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).send({ message: "Image is required" });
      }

      const imageUrl = req.file.path;
      const user = req.user;
      user.profileUrl = imageUrl;
      await user.save();
      return res.send({
        message: "Profile image uploaded successfully",
        profileUrl: imageUrl,
        status: 200,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
);

module.exports = profileRouter;
