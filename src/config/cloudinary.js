const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ProfileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dev-tinder-profile-image", // folder in cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const uploadProfileImageCloudinary = multer({ storage: ProfileImageStorage });

module.exports = uploadProfileImageCloudinary;
