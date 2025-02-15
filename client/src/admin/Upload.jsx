import { useState } from "react";
import axios from "axios";
import { url } from "../api/API";
import Cookies from "js-cookie";
import ProductCart from "./ProductCart.jsx";

const ProductForm = () => {
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    title: "",
    des: "",
    category: "",
    image: "",
  });

  const token = Cookies.get("AdminToken");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Electronics", "Clothing", "Books", "Furniture", "Toys"];

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(url.uploadImage, formData);
      if (!response.data.error) {
        setProduct((prev) => ({ ...prev, image: response.data.data }));
      }
    } catch (error) {
      console.error("Image upload failed", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.image) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const response = await axios.post(url.adminRoutes, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      alert(response.data.msg);

      // Reset form after submission
      setProduct({
        productName: "",
        price: "",
        title: "",
        des: "",
        category: "",
        image: "",
      });
      setFile(null);
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  return (
    <div style={{
      backgroundColor:"black",
      color:"white"
    }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <select name="category" value={product.category} onChange={handleChange} required>
          <option value="">Select a Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="productName"
          value={product.productName}
          placeholder="Product Name"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          value={product.title}
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="des"
          value={product.des}
          placeholder="Description"
          onChange={handleChange}
          required
        />

        {/* Image Upload */}
        <input type="file" onChange={handleFileChange} />
        <button type="button" onClick={uploadImage} disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>

        <button type="submit">Submit</button>
      </form>

      <div>
        <ProductCart />
      </div>
    </div>
  );
};

export default ProductForm;
