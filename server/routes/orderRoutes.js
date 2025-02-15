import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { CreateOrder } from "../controllers/orderControllers.js";


const router = express.Router();

router.post("/",authMiddleware,CreateOrder)


export default router