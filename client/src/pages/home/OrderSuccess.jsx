import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Spin,
  Typography,
  Card,
  Space,
  Empty,
  Button,
  Divider,
  Layout,
  Row,
  Col,
  List,
} from "antd";
import {
  ShoppingCartOutlined,
  FileSearchOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { url } from "../../api/API";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Content } = Layout;

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate()
  const handleContinueShoppingCart=()=>{
    navigate("/")
  }

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("UserToken");
      const response = await axios.get(url.getuserOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Text
          code
          style={{
            fontWeight: "500",
            backgroundColor: "#f0f5ff",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {id.slice(-6)}
        </Text>
      ),
      responsive: ["md"],
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id_short",
      render: (id) => (
        <Text
          code
          style={{
            fontWeight: "500",
            backgroundColor: "#f0f5ff",
            padding: "2px 4px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {id.slice(-6)}
        </Text>
      ),
      responsive: ["xs", "sm"],
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <Text
          strong
          style={{ color: "#389e0d", fontSize: isMobile ? "14px" : "16px" }}
        >
          ${price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag
          color={status === "paid" ? "green" : "gold"}
          style={{
            padding: isMobile ? "2px 4px" : "4px 8px",
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const colorMap = {
          Pending: "orange",
          "On The Way": "blue",
          Delivered: "green",
          Cancelled: "red",
        };
        const iconMap = {
          Pending: <ClockCircleOutlined />,
          "On The Way": <ShoppingCartOutlined />,
          Delivered: <FileSearchOutlined />,
          Cancelled: <ClockCircleOutlined />,
        };
        return (
          <Tag
            color={colorMap[status]}
            style={{
              padding: isMobile ? "2px 4px" : "4px 8px",
              fontSize: isMobile ? "12px" : "14px",
            }}
          >
            <Space size={isMobile ? "small" : "middle"}>
              {iconMap[status]}
              {isMobile && status.length > 7
                ? status.substring(0, 7) + "..."
                : status}
            </Space>
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text
          style={{
            color: "#555",
            fontWeight: "500",
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          {isMobile
            ? new Date(date).toLocaleDateString()
            : new Date(date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
        </Text>
      ),
    },
  ];

  const renderOrderCard = (order) => {
    const colorMap = {
      Pending: "orange",
      "On The Way": "blue",
      Delivered: "green",
      Cancelled: "red",
    };

    const iconMap = {
      Pending: <ClockCircleOutlined />,
      "On The Way": <ShoppingCartOutlined />,
      Delivered: <FileSearchOutlined />,
      Cancelled: <ClockCircleOutlined />,
    };
   

    return (
      <Card
        style={{
          marginBottom: "12px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          width: "100%",
        }}
        size="small"
      >
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Order ID:
            </Text>
            <div>
              <Text code style={{ backgroundColor: "#f0f5ff" }}>
                {order._id.slice(-6)}
              </Text>
            </div>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Date:
            </Text>
            <div>
              <Text style={{ fontSize: "12px" }}>
                <CalendarOutlined style={{ marginRight: "4px" }} />
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Total:
            </Text>
            <div>
              <Text strong style={{ color: "#389e0d", fontSize: "14px" }}>
                <DollarOutlined style={{ marginRight: "4px" }} />
                {order.totalPrice.toFixed(2)}
              </Text>
            </div>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Payment:
            </Text>
            <div>
              <Tag
                color={order.paymentStatus === "paid" ? "green" : "gold"}
                style={{ padding: "2px 4px", fontSize: "12px" }}
              >
                {order.paymentStatus.toUpperCase()}
              </Tag>
            </div>
          </Col>
          <Col span={24}>
            <Divider style={{ margin: "8px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Status:
              </Text>
              <Tag
                color={colorMap[order.orderStatus]}
                style={{ padding: "2px 4px", fontSize: "12px" }}
              >
                <Space size="small">
                  {iconMap[order.orderStatus]}
                  {order.orderStatus}
                </Space>
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Layout
      style={{ minHeight: "100vh", width: "100%", backgroundColor: "#f5f5f5" }}
    >
      <Navbar />
      <Content
        style={{
          padding: isMobile ? "12px" : "24px",
          width: "100%",
          marginTop: "0px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <Card
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderRadius: "8px",
              marginBottom: isMobile ? "12px" : "24px",
              background: "linear-gradient(135deg, #f6f9fe 0%, #ffffff 100%)",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? "8px" : "0",
                width: "100%",
              }}
            >
              <Title
                level={isMobile ? 3 : 2}
                style={{ margin: 0, color: "#1a1a1a" }}
              >
                <Space>
                  <ShoppingCartOutlined style={{ color: "#1890ff" }} />
                  My Orders
                </Space>
              </Title>
              <Text
                type="secondary"
                style={{ fontSize: isMobile ? "12px" : "14px" }}
              >
                View and track your purchase history
              </Text>
            </div>
          </Card>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: isMobile ? "40px 0" : "80px 0",
                width: "100%",
              }}
            >
              <Spin size={isMobile ? "default" : "large"} />
              <Text
                style={{
                  display: "block",
                  marginTop: "16px",
                  color: "#666",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                Loading your orders...
              </Text>
            </div>
          ) : orders.length === 0 ? (
            <Card
              style={{
                textAlign: "center",
                padding: isMobile ? "20px" : "40px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                width: "100%",
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: "#555",
                    }}
                  >
                    You haven't placed any orders yet
                  </Text>
                }
              />
              <Divider style={{ margin: isMobile ? "16px 0" : "24px 0" }} />
              <Button
              onClick={handleContinueShoppingCart}
                type="primary"
                size={isMobile ? "middle" : "large"}
                icon={<ShoppingCartOutlined />}
              >
                Start Shopping
              </Button>
            </Card>
          ) : isMobile ? (
            <List
              dataSource={orders}
              renderItem={renderOrderCard}
              style={{ padding: "4px", width: "100%" }}
            />
          ) : (
            <Card
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                borderRadius: "8px",
                overflow: "hidden",
                width: "100%",
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                pagination={{
                  pageSize: 10,
                  position: ["bottomCenter"],
                  showSizeChanger: false,
                  size: windowWidth < 992 ? "small" : "default",
                }}
                style={{ width: "100%" }}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
                scroll={{ x: true }}
                size={windowWidth < 992 ? "small" : "middle"}
              />
            </Card>
          )}
        </div>
      </Content>
      <style jsx global>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f5ff;
          color: #1a1a1a;
          font-weight: 600;
        }
        .ant-table-container table > thead > tr:first-child th:first-child {
          border-top-left-radius: 8px;
        }
        .ant-table-container table > thead > tr:first-child th:last-child {
          border-top-right-radius: 8px;
        }
        .ant-table {
          width: 100%;
          max-width: 100%;
        }
        .ant-card-body {
          width: 100%;
        }
        .ant-table-wrapper {
          width: 100%;
        }
        @media (max-width: 768px) {
          .ant-table-thead > tr > th {
            padding: 8px 4px;
            font-size: 12px;
          }
          .ant-table-tbody > tr > td {
            padding: 8px 4px;
          }
        }
      `}</style>
    </Layout>
  );
}

export default UserOrders;
