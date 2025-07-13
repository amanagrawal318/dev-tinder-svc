require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");
const validator = require("validator");
const User = require("./Models/User");
const validateData = require("./utils/vaildation");
const app = express();
const port = 5000;

app.use(express.json());

// POST: Signup API
app.post("/signup", async (req, res) => {
  try {
    validateData(req.body);
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.send("User saved successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Enter Valid Email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }
    res.send("User logged in successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: get user
app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: get feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: delete user
app.delete("/user/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH: update user
app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  try {
    const ALLOWED_UPDATE_FIELDS = [
      "firstName",
      "lastName",
      "gender",
      "about",
      "profileUrl",
      "skills",
    ];
    const isValidOperation = Object.keys(data).every((update) =>
      ALLOWED_UPDATE_FIELDS.includes(update)
    );
    if (!isValidOperation) {
      throw new Error("Invalid update");
    }
    const user = await User.findByIdAndUpdate(req.params?.userId, data, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.send("user updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`server is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Database connection error", err));
