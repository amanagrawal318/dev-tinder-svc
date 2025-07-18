const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/User");
// POST: send connection request
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const ALLOWED_STATUS = ["ignored", "interested"];
    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error(`Invalid status type: ${status}`);
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error("User not found");
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    if (existingConnectionRequest) {
      throw new Error("Connection request already exists");
    }
    const connectionRequest = await new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const savedRequest = await connectionRequest.save();
    res.send({
      message: `${req.user.firstName} sent ${status} connection request to ${toUser.firstName}`,
      status: 200,
      data: savedRequest,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST: review connection request
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;

    const ALLOWED_STATUS = ["accepted", "rejected"];
    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error(`Invalid status type: ${status}`);
    }
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      throw new Error("Connection request not found");
    }
    connectionRequest.status = status;
    const savedRequest = await connectionRequest.save();
    res.send({
      message: `Connection request ${status} successfully`,
      status: 200,
      data: savedRequest,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = requestRouter;
