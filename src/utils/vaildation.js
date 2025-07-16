const validator = require("validator");
const validateData = (data) => {
  const { firstName, lastName, email, password } = data;
  if (!firstName) {
    throw new Error("First name is required");
  } else if (!lastName) {
    throw new Error("Last name is required");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("Enter Valid Email");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password");
  }
};

const validateProfileFields = (req) => {
  const ALLOWED_UPDATE_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "profileUrl",
    "skills",
  ];
  const isValidOperation = Object.keys(req.body).every((update) =>
    ALLOWED_UPDATE_FIELDS.includes(update)
  );
  return isValidOperation;
};

module.exports = { validateData, validateProfileFields };
