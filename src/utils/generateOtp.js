const generateOTP = (length) => {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length parameter must be a positive integer");
  }

  // Characters to use for the OTP
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    // Pick a random digit
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};

module.exports = generateOTP;
