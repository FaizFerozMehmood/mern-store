import express from "express"
import { getProduct } from "../controllers/adminController.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import {publicAccess} from "../middleware/admin-middleWare.js"
import { findProductCategories, searchProducts } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/products", getProduct )
router.get("/search", authMiddleware, searchProducts);
router.get("/findCategory",authMiddleware,findProductCategories)


  
  export default router;