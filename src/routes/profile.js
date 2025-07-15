const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../Middleware/auth");

// GET: get profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = profileRouter;
