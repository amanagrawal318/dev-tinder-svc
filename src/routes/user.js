const express = require("express");
const { userAuth } = require("../Middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../Models/connectionRequest");
const POPULATE_FIELDS = "firstName lastName profileUrl age gender";

// GET: get received connection requests
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", POPULATE_FIELDS);

    if (!connectionRequest || connectionRequest.length === 0) {
      throw new Error("No connection requests found");
    }
    res.send({
      message: "Connection requests received successfully",
      status: 200,
      data: connectionRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: get connections
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", POPULATE_FIELDS);

    if (!connectionRequest || connectionRequest.length === 0) {
      throw new Error("No connections found");
    }
    const data = connectionRequest.map((request) => {
      if (request.fromUserId.equals(loggedInUser._id)) {
        return request.toUserId;
      } else {
        return request.fromUserId;
      }
    });

    res.send({
      message: "Connections fetched successfully",
      status: 200,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
