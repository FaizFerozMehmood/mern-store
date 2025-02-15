import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import sendResponse from "../helpers/sendResponse.js";

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
