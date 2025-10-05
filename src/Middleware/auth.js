const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies["accessToken"];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    // If token expired, client should call /auth/refresh-token
    return res.status(401).json({ message: "Access token expired" });
  }
};

module.exports = {
  userAuth,
};
