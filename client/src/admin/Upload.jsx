import { useState } from "react";
import axios from "axios";
import { url } from "../api/API";
import AdminNav from "./AdminNav.jsx";

const ProductForm = () => {
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    title: "",
    des: "",
    category: "",
    image: "",
  });

  const token = localStorage.getItem("AdminToken");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Dry Fruits",
    "Furniture",
    "Toys",
    "Makeup",
    "Perfumes",
    "Headphones",
    "Educational & Academic Books",
  ];

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
      // console.error("Image upload failed", error);
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
      alert(response.data.msg);
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
      // console.error("Error adding product", error);
    }
  };

  return (
    <div
      style={
        {
          // fontFamily: "Arial, sans-serif", padding: "20px"
          // marginTop:"0px"
        }
      }
    >
      <AdminNav
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(228, 237, 230)",
        }}
      />
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          marginTop: "90px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Add Product</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
          >
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
            style={{ marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="number"
            name="price"
            value={product.price}
            placeholder="Price"
            onChange={handleChange}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="text"
            name="title"
            value={product.title}
            placeholder="Title"
            onChange={handleChange}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
          />
          <textarea
            name="des"
            value={product.des}
            placeholder="Description"
            onChange={handleChange}
            required
            style={{ marginBottom: "10px", padding: "8px", minHeight: "80px" }}
          />

          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginBottom: "10px" }}
          />
          <button
            type="button"
            onClick={uploadImage}
            disabled={loading}
            style={{
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>

          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
