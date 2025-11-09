const express = require("express");
const { userAuth } = require("../Middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/User");
const POPULATE_FIELDS = "firstName lastName profileUrl age gender about skills lastActiveAt";
const BlockedUser = require("../Models/BlockedUser");
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

    const blockedUsers = await BlockedUser.find({
      $or: [
        { blockedUserId: loggedInUser._id },
        { blockedByUserId: loggedInUser._id },
      ],
    }).select("blockedUserId blockedByUserId");

    const updatedData = data.map((user) => {
      const userBlocked = blockedUsers.find(
        (blockedUser) =>
          (blockedUser.blockedUserId.equals(user._id) &&
            blockedUser.blockedByUserId.equals(loggedInUser._id)) ||
          (blockedUser.blockedUserId.equals(loggedInUser._id) &&
            blockedUser.blockedByUserId.equals(user._id))
      );

      if (!userBlocked) {
        return user;
      }
      if (userBlocked.blockedByUserId.equals(loggedInUser._id)) {
        return { ...user.toObject(), isBlocked: true };
      }
      if (userBlocked.blockedUserId.equals(loggedInUser._id)) {
        return;
      }
      return user;
    }).filter(Boolean);

    res.send({
      message: "Connections fetched successfully",
      status: 200,
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: get feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    limit = limit > 50 ? 50 : limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    const blockedUsers = await BlockedUser.find({
      $or: [
        { blockedUserId: loggedInUser._id },
        { blockedByUserId: loggedInUser._id },
      ],
    }).select("blockedUserId blockedByUserId");

    blockedUsers.forEach((block) => {
      if (block.blockedByUserId.equals(loggedInUser._id)) {
        hideUsersFromFeed.add(block.blockedUserId.toString());
      } else {
        hideUsersFromFeed.add(block.blockedByUserId.toString());
      }
    });

    const data = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(POPULATE_FIELDS)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
