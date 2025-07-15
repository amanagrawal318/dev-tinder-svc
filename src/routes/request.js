const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../Middleware/auth");

requestRouter.post("/sendConnection", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " has sent you a connection request");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = requestRouter;
