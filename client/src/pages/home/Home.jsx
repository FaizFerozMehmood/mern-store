import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { url } from "../../api/API";
import { Card, Col, Row, Typography, Spin } from "antd";
import Navbar from "./Navbar";

const { Title, Text } = Typography;

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  // const [IsHovered,setIsHovered] = useState(false)
  useEffect(() => {
    const token =
      localStorage.getItem("UserToken") || localStorage.getItem("AdminToken");
    if (!token) {
      return navigate("/login");
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
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
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
      console.log("Error searching products:", error);
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

  const handleAddToCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cartItem")) || [];
    let existItem = cart.find((item) => item.id === id);
    if (existItem) {
      existItem.quantity += 1;
    } else {
      cart.push({ id, quantity: 1 });
    }
    localStorage.setItem("cartItem", JSON.stringify(cart));
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "rgba(245, 249, 250)",
        }}
      >
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "10px 60px", borderRadius: "3px" }}
            type="search"
            placeholder="Search products"
          />
        </div>
        <Row gutter={[16, 16]} justify="center">
          {loading ? (
            <Spin size="large" />
          ) : data.length > 0 ? (
            data.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  // hoverable
                  cover={
                    <img
                      alt={product.title}
                      src={product.image}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                  style={{ borderRadius: "10px", overflow: "hidden" }}
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
                      // className="my-button"
                      // onMouseEnter={() => setIsHovered(true)}
                      // onMouseLeave={() => setIsHovered(false)}
                      onClick={() => handleAddToCart(product._id)}
                      style={{
                        marginTop: "20px",
                        fontSize: "20px",
                        color: "white",
                        backgroundColor: "black",
                        cursor: "pointer",
                        padding: "5px 40px",
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
