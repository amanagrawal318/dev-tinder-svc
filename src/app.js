require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");
const userRouter = require("./routes/user");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

// Debugging endpoint to view Swagger schema
app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocs);
});
/*
// GET: get feed
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: delete user
app.delete("/user", userAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH: update user
app.patch("/user", userAuth, async (req, res) => {
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
    const user = await User.findByIdAndUpdate(req.user._id, data, {
      runValidators: true,
    });
    if (!user) {
      throw new Error({ message: "User not found" });
    }
    res.send("user updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: logout
app.post("/logout", userAuth, (req, res) => {
  try {
    res.clearCookie("token");
    res.send("User logged out successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
*/

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`server is listening at http://localhost:${port}`);
      console.log(
        `Swagger docs available at http://localhost:${port}/api-docs`
      );
    });
  })
  .catch((err) => console.log("Database connection error", err));
