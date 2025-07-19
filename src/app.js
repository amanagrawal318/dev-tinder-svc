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
