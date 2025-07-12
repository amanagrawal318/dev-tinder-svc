const AdminAuth = (req, res, next) => {
  console.log("Admin Middleware");
  const token = "ac";
  const isAuthenticated = token === "abc";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

const isUserLogin = (req, res, next) => {
  console.log("User Middleware");
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("UserUnauthorized");
  } else {
    next();
  }
};

module.exports = {
  AdminAuth,
  isUserLogin,
};
