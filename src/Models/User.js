const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password should be strong");
        }
      },
    },
    age: {
      type: Number,
      default: 18,
    },
    gender: {
      type: String,
      // enum: ["male", "female", "other"],
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender should be male, female or other");
        }
      },
    },
    about: {
      type: String,
      default: "I am a new user",
    },
    profileUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Profile URL is invalid " + value);
        }
      },
    },
    skills: {
      type: [String],
      default: [],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills should be less than 10");
        }
      },
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
