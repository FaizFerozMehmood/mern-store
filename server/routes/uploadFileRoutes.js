import express from "express";
import multer from "multer";
import os from "os";
import fs from "fs";
import { uploadFileController } from "../controllers/uploadFileController.js";

const uploadFileRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = os.tmpdir();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

uploadFileRouter.post("/upload", upload.single("file"), uploadFileController);

export default uploadFileRouter;




