require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 5000;

app.use("/", (req, res) => res.send("Hello World!"));

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`server is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Database connection error", err));
