import jwt from "jsonwebtoken";
import sendResponse from "../helpers/sendResponse.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendResponse(
        res,
        401,
        null,
        true,
        "Unauthorized: No token provided."
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return sendResponse(res, 401, null, true, "unauthorized,Invalid token.");
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(
      res,
      401,
      null,
      true,
      "Unauthorized: Invalid or expired token."
    );
  }
};

export default authMiddleware;
