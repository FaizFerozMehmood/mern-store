import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { url } from "../../api/API";
import Cookies from "js-cookie";
import { Card, Col, Row, Typography, Spin } from "antd";
import Navbar from "./Navbar";

const { Title, Text } = Typography;

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("UserToken");
      setLoading(true);
      const response = await axios.get(url.getProducts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setData(response.data?.data);
    } catch (error) {
      setLoading(false);
      console.log("error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // const navigate = useNavigate();
  // const userInfo = Cookies.get("userInfo");

  const handleAddToCart = async (id) => {
    console.log("iddd", id);
    let cart = JSON.parse(localStorage.getItem("cartItem")) || [];
    let existitem = cart.find((item) => item.id === id);
    if (existitem) {
      existitem.quantity += 1;
    } else {
      cart.push({ id, quantity: 1 });
    }
    localStorage.setItem("cartItem", JSON.stringify(cart));
    console.log("cart====>", cart);
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
        <Row gutter={[16, 16]} justify="center">
          {loading ? (
            <Spin size="large" />
          ) : data.length > 0 ? (
            data.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
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
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <button
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
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
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
