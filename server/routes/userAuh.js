import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import sendResponse from "../helpers/sendResponse.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(4),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  role: Joi.string().valid("admin", "user").default("user"),
});

router.post("/register", async (req, res) => {
  // console.log("Incoming request body:", req.body);
  // console.log("Received request headers:", req.headers);
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      // console.log("error====>", error);
      return sendResponse(res, 400, null, true, error.details[0].message);
    }
    value.email = value.email.toLowerCase();

    const isExists = await User.findOne({ email: value.email });
    if (isExists)
      return sendResponse(
        res,
        403,
        null,
        true,
        "User with this email is already registered"
      );

    const hashedPassword = await bcrypt.hash(value.password, 10);
    // console.log(hashedPassword);

    value.password = hashedPassword;

    // console.log("value====>", value);
    const newUser = await User.create(value);

    return sendResponse(res, 201, newUser, false, "registration successful!");
  } catch (error) {
    // console.log(error);
    return sendResponse(res, 500, null, true, "internal server error", error);
  }
});

const loginSchema = Joi.object({
  password: Joi.string().min(4),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    // console.log(error);
    // console.log(value);
    if (error)
      return sendResponse(res, 400, null, true, error.details[0].message);
    value.email = value.email.toLowerCase();
    const user = await User.findOne({ email: value.email }).lean();
    if (!user)
      return sendResponse(res, 403, null, true, "User is not registered!");
    if (!value.email || !value.password)
      return sendResponse(res, 403, null, true, "All fields are required!");
    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid)
      return sendResponse(res, 403, null, true, "invalid credentials!");
    delete user.password;

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendResponse(res, 200, { user, token }, false, "Login successful!");
  } catch (error) {
    // console.log(error);
    return sendResponse(res, 500, null, true, "internal server error", error);
  }
});

export default router;
