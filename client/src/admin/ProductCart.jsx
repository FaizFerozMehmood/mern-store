import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Card, Col, Row, Typography, Spin } from "antd";
import { url } from "../api/API";
import Navbar from "./AdminNav";

const { Title, Text } = Typography;

const ProductCart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("AdminToken");

      if (!token) {
        console.error("No token found for GET request!");
        return;
      }

      setLoading(true);
      const response = await axios.get(url.getProducts, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data?.data);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  

  const handleDelete = async (id) => {
    const token = localStorage.getItem("AdminToken");

    if (!token) {
      console.error("No token found for DELETE request!");
      return;
    }

    try {
      await axios.delete(`${url.deleteProduct}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      getProducts();
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error);
    }
  };

  return (

    <div style={{ margin:"0px", textAlign: "center" }}>
      <Navbar/>
     

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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(product._id)}
                    style={{ marginTop: "20px", fontSize: "22px" }}
                  />
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Text type="danger">No products found!</Text>
        )}
      </Row>
    </div>
  );
};

export default ProductCart;
