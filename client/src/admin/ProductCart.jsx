import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Card, Col, Row, Typography, Spin } from "antd";
import { url } from "../api/API";

const { Title, Text } = Typography;

function ProductCart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      // const token = Cookies.get("adminToken");
      const token = localStorage.getItem("AdminToken")
      console.log("Token in GET request:", token);
      
      if (!token) {
        console.error("No token found for GET request!");
        return;
      }

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
      console.error("Error fetching products:", error.response?.data || error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleLogout = () => {
    Cookies.remove("userInfo");
    // Cookies.remove("userToken");
    // Cookies.remove("adminToken");
    navigate("/login");
    localStorage.clear();

  };

  const handleDelete = async (id) => {
    console.log("clicked", id);
    // const token = Cookies.get("adminToken");
    const token = localStorage.getItem("AdminToken")
    console.log("Token in DELETE request:", token);
    
    if (!token) {
      console.error("No token found for DELETE request!");
      return;
    }

    try {
      const response = await axios.delete(`${url.deleteProduct}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete response:", response.data);
      getProducts()
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Logout Button */}
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Logout
      </Button>

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
                <Text strong style={{ display: "block", marginBottom: "10px" }}>
                  ${product.price}
                </Text>
                <Text type="secondary">{product.des}</Text>
                <button onClick={() => handleDelete(product._id)}>
                  <DeleteOutlined
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      color: "red",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  />
                </button>
              </Card>
            </Col>
          ))
        ) : (
          <Text type="danger">No products found!</Text>
        )}
      </Row>
    </div>
  );
}

export default ProductCart;
