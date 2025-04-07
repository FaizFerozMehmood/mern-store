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
  // console.log("data",data.length);
  localStorage.setItem("totalProducts",data.length)
  

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("AdminToken");
      if (!token) return;

      setLoading(true);
      const response = await axios.get(url.getProducts, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data?.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("AdminToken");
    if (!token) return;

    try {
      await axios.delete(`${url.deleteProduct}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Product deleted successfully!");
      getProducts();
    } catch (error) {
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
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Title level={2} style={{ marginBottom: "24px", textAlign: "center" }}>
          Products
        </Title>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {data.length > 0 ? (
              data.map((product) => (
                <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    style={{
                      height: "100%",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                    }}
                    bodyStyle={{ padding: "16px" }}
                    cover={
                      <div
                        style={{
                          height: "220px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          alt={product.title}
                          src={product.image}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Title
                        level={4}
                        style={{
                          fontSize: "16px",
                          marginBottom: "6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.title}
                      </Title>

                      <Text
                        strong
                        style={{
                          fontSize: "18px",
                          color: "#1890ff",
                          marginBottom: "8px",
                        }}
                      >
                        ${product.price}
                      </Text>

                      <Text
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          marginBottom: "12px",
                        }}
                      >
                        {product.des}
                      </Text>

                      <div style={{ marginTop: "auto" }}>
                        <Button
                          danger
                          type="primary"
                          icon={<DeleteOutlined />}
                          onClick={() => showDeleteConfirm(product._id)}
                          style={{
                            width: "100%",
                            borderRadius: "4px",
                            marginTop: "auto",
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    No products found!
                  </Text>
                </div>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

export default ProductCart;
