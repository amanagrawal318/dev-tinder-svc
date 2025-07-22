const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
