const nodemailer = require("nodemailer");

// Function to send an OTP email
const sendEmail = async (email, otp) => {
  // Create Nodemailer transporter for Sendinblue
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // Use false for TLS
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_EMAIL, // Sender's email address
    to: email, // Receiver's email address
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;
