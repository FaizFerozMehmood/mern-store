import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { CreateOrder, getOrders,getUserOrders,updateOrderStatus } from "../controllers/orderControllers.js";
import adminRole from "../middleware/admin-middleWare.js";


const router = express.Router();

router.post("/",authMiddleware,CreateOrder)
router.get("/getOrders",authMiddleware,getOrders)
router.put("/:id",authMiddleware,adminRole,updateOrderStatus),
router.get("/myorder",authMiddleware,getUserOrders)


export default router;      