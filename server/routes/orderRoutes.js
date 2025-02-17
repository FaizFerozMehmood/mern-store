import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { CreateOrder, getOrders,updateOrderStatus } from "../controllers/orderControllers.js";
import adminRole from "../middleware/admin-middleWare.js";


const router = express.Router();

router.post("/",authMiddleware,CreateOrder)
router.get("/",authMiddleware,adminRole,getOrders)
router.put("/:id/status",authMiddleware,adminRole,updateOrderStatus)


export default router;    