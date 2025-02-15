import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminRole from "../middleware/admin-middleWare.js";
import { addProduct } from "../controllers/adminController.js";
import { deleteProduct } from "../controllers/adminController.js";

const router = express.Router();

router.post("/admin", authMiddleware, adminRole, addProduct);
router.delete("/admin/:id", authMiddleware, adminRole, deleteProduct);

export default router;
