require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./Models/User");
const app = express();
const port = 5000;

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "sachin",
    lastName: "user",
    email: "sachin@gmail.com",
    password: "sachin",
  });

  try {
    await user.save();
    res.send("User saved successfully");
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
