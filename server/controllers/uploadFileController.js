import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import sendResponse from "../helpers/sendResponse.js";
import User from "../models/userModel.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 403, null, true, "No file uploaded.");
    }

    // console.log("Local file path:", req.file.path);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    return sendResponse(res, 200, result.secure_url, false, "File uploaded successfully!");
  } catch (error) {
    return sendResponse(res, 500, null, true, "File upload failed", error);
  }
};


// import fs from "fs";

export const uploadPrOrofileController = async (req, res) => {
  try {
    const localPath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localPath, {
      folder: "profile_images",
    });

    // Remove local file after upload
    fs.unlinkSync(localPath);

    // Save the image URL to the user in MongoDB
    const userId = req.user.id; // Make sure you're using auth middleware!
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image uploaded",
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};
