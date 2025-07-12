require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./Models/User");
const app = express();
const port = 5000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/user/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, data);
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
