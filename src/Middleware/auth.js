const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      throw new Error("Token not found");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
