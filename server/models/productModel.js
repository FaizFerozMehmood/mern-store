import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: "" },
  title: { type: String, required: true },
  des: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);


export default Product;
