const mongoose = require("mongoose");

const blockedUserSchema = new mongoose.Schema(
  {
    blockedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

blockedUserSchema.index(
  { blockedUserId: 1, blockedByUserId: 1 },
  { unique: true }
);

blockedUserSchema.pre("save", function (next) {
  if (this.blockedUserId.equals(this.blockedByUserId)) {
    throw new Error("You cannot block yourself");
  }
  next();
});

module.exports = mongoose.model("BlockedUser", blockedUserSchema);
