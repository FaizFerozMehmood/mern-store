import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { url } from "../../api/API";
import { Card, Col, Row, Typography, Spin } from "antd";
import Navbar from "./Navbar";
import Carousel from "./Carousel";

const { Title, Text } = Typography;

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [leng, setLeng] = useState();
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState();

  // abc to push changes on github ...
  // console.log("selected",selectedValue);
  const images = [
    {
      src: "https://images.unsplash.com/photo-1524593656068-fbac72624bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFByZW1pdW0lMjBxdWFsaXR5JTIwY2FzaGV3cyUyMG51dHN8ZW58MHx8MHx8fDA%3D",
      alt: "Image 1 description",
    },
    {
      src: "https://res.cloudinary.com/dyno1fhq3/image/upload/v1739901487/uploads/u2n5sw2fivl1wijztuam.avif",
      alt: "Image 2 description",
    },
    {
      src: "https://scentsnstories.pk/cdn/shop/files/Women_Banner_4bf0849e-2062-4e4f-9aaa-7b4bd49c2e53.webp?v=1725359537&width=1600",
      alt: "Image 3 description",
    },
    {
      src: "https://res.cloudinary.com/dyno1fhq3/image/upload/v1739902341/uploads/i3c2jlyypinnbyplfxn4.webp",
      alt: "Image 4 description",
    },
  ];

  const UserToken = localStorage.getItem("UserToken");
  const AdminToken = localStorage.getItem("AdminToken");
  useEffect(() => {
    console.log(UserToken, "admin       ", AdminToken);

    if (UserToken) {
      navigate("/");
    }
  }, [navigate]);
  const getProducts = async () => {
    try {
      const token = localStorage.getItem("UserToken");
      setLoading(true);
      const response = await axios.get(url.getProducts, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    handleCategoryChanges(newValue);
  };
  const handleCategoryChanges = async (category) => {
    if (!category) {
      return;
    }
    const token = localStorage.getItem("UserToken");
    const response = await axios.get(url.findByCategories, {
      headers: { Authorization: `Bearer ${token}` },
      params: { category: category },
    });
    // console.log("response category",response.data?.data);
    setData(response.data?.data);
  };
  const handleReset = () => {
    setData([]);
    getProducts();
  };
  const searchProductFun = async () => {
    if (!search.trim()) {
      getProducts();
      return;
    }

    try {
      const token = localStorage.getItem("UserToken");
      setLoading(true);
      const response = await axios.get(
        `${url.searchProducts}/?search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data?.data || []);
    } catch (error) {
      // console.log("Error searching products:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    searchProductFun();
  }, [search]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItem")) || [];
    setLeng(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  const handleAddToCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cartItem")) || [];
    // console.log("cart", cart.length);
    let existItem = cart.find((item) => item.id === id);
    if (existItem) {
      existItem.quantity += 1;
    } else {
      cart.push({ id, quantity: 1 });
    }
    localStorage.setItem("cartItem", JSON.stringify(cart));
    setLeng(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  return (
    <div>
      <Navbar leng={leng} />

      <div
        style={{
          marginTop: "1px",
          height: "150px",
        }}
      >
        <Carousel
          images={images}
          autoPlayInterval={2000}
          showDots={true}
          showArrows={true}
        />
      </div>
      <div
        style={{
          marginTop: "150px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "rgba(245, 249, 250)",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              flex: "1",
              minWidth: "200px",
              maxWidth: "250px",
              border: "1px solid #ccc",
            }}
            type="search"
            placeholder="Search products"
          />

          <select
            id="dropdown"
            value={selectedValue}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              minWidth: "150px",
            }}
          >
            <option value="">Choose a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Dry Fruits">Dry Fruits</option>
            <option value="Furniture">Furniture</option>
            <option value="Toys">Toys</option>
            <option value="Makeup">Makeup</option>
            <option value="Perfumes">Perfumes</option>
            <option value="Headphones">Headphones</option>
            <option value="Educational & Academic Books">
              Educational & Academic Books
            </option>
          </select>

          <button
            onClick={handleReset}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Reset
          </button>
        </div>

        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
          {loading ? (
            <Spin size="large" />
          ) : data.length > 0 ? (
            data.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  cover={
                    <img
                      alt={product.title}
                      src={
                        product.image ||
                        "https://images.unsplash.com/photo-1513589669142-c71a6de1ed20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZHVtbXklMjBpbWFnYWV8ZW58MHx8MHx8fDA%3D"
                      }
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  <Title level={4}>{product.title}</Title>
                  <Text
                    strong
                    style={{ display: "block", marginBottom: "10px" }}
                  >
                    ${product.price}
                  </Text>
                  <Text type="secondary">{product.des}</Text>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      style={{
                        marginTop: "20px",
                        fontSize: "16px",
                        color: "white",
                        backgroundColor: "black",
                        cursor: "pointer",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Text type="danger">No products found!</Text>
          )}
        </Row>
      </div>
    </div>
  );
}

export default Home;
