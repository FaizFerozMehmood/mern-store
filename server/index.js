import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./connectDatabase.js";
import userAuth from "./routes/userAuh.js"
import adminRoutes from "./routes/adminRoutes.js"
import uploadFileRouter from "./routes/uploadFileRoutes.js";
// import { getProduct } from "./controllers/userController.js";
import getProducts from "./routes/userRoutes.js"
import productRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cors from "cors"
dotenv.config();


const PORT = process.env.PORT

connectDb()
const app = express()
app.use(express.json());
// app.use(cors({
//     // origin:"http://localhost:5173",
//     credentials: true,
// }))

app.use(
    cors({
      // origin: 'http://localhost:5173',
      origin :"https://mern-store-wens.vercel.app/",
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );      
  app.options('*', cors());

app.use("/api/auth",userAuth)
app.use("/admin", adminRoutes)
app.use("/api/files", uploadFileRouter);
app.use("/user",getProducts)
// app.use("/products",searchproduct)
app.use("/products", productRoutes) // to search products
app.use("/api/orders",orderRoutes)

// ADMIN CAN DELETE PRODUCTS ON:
// http://localhost:5000/admin/admin/id
// UPDATE ORDER STATUS:
// http://localhost:5000/api/orders/67b0a42f1c9733dade515ac0/status

app.listen(PORT,()=>{
    console.log(`server is listening on : http://localhost:${PORT} `);
})

   
console.log("hello");
