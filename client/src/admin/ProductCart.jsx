import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Card, Col, Row, Typography, Spin, Modal, message } from "antd";
import { url } from "../api/API";
import Navbar from "./AdminNav";

const { Title, Text } = Typography;

const ProductCart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

      message.success("Product deleted successfully!");
      getProducts();
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error);
      message.error("Failed to delete product.");
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => handleDelete(id),
    });
  };

  return (
    <div style={{}}>
      <Navbar />

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
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  />
                }
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s",
                }}
                bodyStyle={{ padding: "16px" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Title
                  level={4}
                  style={{
                    fontSize: "18px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.title}
                </Title>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    fontSize: "16px",
                  }}
                >
                  ${product.price}
                </Text>
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", wordBreak: "break-word" }}
                >
                  {product.des}
                </Text>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(product._id)}
                    style={{ fontSize: "22px" }}
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
