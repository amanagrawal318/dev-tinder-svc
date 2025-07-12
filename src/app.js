const express = require("express");
const { AdminAuth, isUserLogin } = require("./Middleware/auth");
const app = express();
const port = 5000;

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     console.log(err);
//     res.status(401).send("Unauthorized");
//   }
// });

app.use("/admin", AdminAuth);

app.get("/admin/getAdmin", (req, res) => {
  console.log("Admin get");
  res.send("Admin fetched");
});

app.get("/user/getuser", isUserLogin, (req, res) => {
  res.send("User Fetched");
});

app.listen(port, () => {
  console.log(`server is listening at http://localhost:${port}`);
});
