import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Spin,
  Typography,
  Card,
  Space,
  Select,
  Button,
  Modal,
  List,
  Drawer,
  Row,
  Col,
  Divider,
} from "antd";
import { EyeOutlined, MenuOutlined } from "@ant-design/icons";
import { url } from "../api/API";
import Navbar from "./AdminNav";
import { useMediaQuery } from "react-responsive";

const { Title, Text } = Typography;
const { Option } = Select;

function GetOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  const GetOrdersfromDB = async () => {
    try {
      const token = localStorage.getItem("AdminToken");
      const response = await axios.get(url.getPlacedOrders, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedOrders =
        response.data?.data?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("AdminToken");
      await axios.put(
        `${url.updateOrderStatus}/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      GetOrdersfromDB();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    GetOrdersfromDB();
  }, []);

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };
  const getColumns = () => {
    const baseColumns = [
      {
        title: "Order ID",
        dataIndex: "_id",
        key: "_id",
        render: (id) => <Text code>{id.slice(-6)}</Text>,
      },
      {
        title: "Customer",
        dataIndex: "user",
        key: "user",
        render: (user) => (
          <Text strong>
            {isMobile ? user?.name : `${user?.name} (${user?.email})`}
          </Text>
        ),
        responsive: ["xs", "sm", "md", "lg", "xl"],
      },
      {
        title: "Total",
        dataIndex: "totalPrice",
        key: "totalPrice",
        render: (price) => (
          <Text strong style={{ color: "#1890ff" }}>
            ${price.toFixed(2)}
          </Text>
        ),
      },
      {
        title: "Status",
        dataIndex: "orderStatus",
        key: "orderStatus",
        render: (status, record) => {
          const colorMap = {
            Pending: "orange",
            "On The Way": "blue",
            Delivered: "green",
            Cancelled: "red",
          };

          return isMobile ? (
            <Tag color={colorMap[status]}>{status}</Tag>
          ) : (
            <Space direction={isTablet ? "vertical" : "horizontal"}>
              <Tag color={colorMap[status]}>{status}</Tag>
              <Select
                value={status}
                onChange={(newStatus) =>
                  handleOrderStatus(record._id, newStatus)
                }
                style={{ width: isTablet ? 100 : 130 }}
                size={isMobile ? "small" : "middle"}
              >
                {["Pending", "On The Way", "Delivered", "Cancelled"].map(
                  (s) => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  )
                )}
              </Select>
            </Space>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Button
            type="primary"
            size={isMobile ? "small" : "middle"}
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record)}
          >
            {isMobile ? "" : "View"}
          </Button>
        ),
      },
    ];

    const desktopColumns = [
      {
        title: "Payment",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: (status) => (
          <Tag
            color={
              status === "paid" ? "green" : status === "failed" ? "red" : "gold"
            }
          >
            {status.toUpperCase()}
          </Tag>
        ),
        responsive: ["md", "lg", "xl"],
      },
      {
        title: "City",
        dataIndex: "orderDeliveryAddress",
        key: "orderDeliveryAddress",
        render: (address) => <Text>{address?.city}</Text>,
        responsive: ["md", "lg", "xl"],
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => (
          <Text strong style={{ color: "#d48806" }}>
            {new Date(date).toLocaleDateString()}
          </Text>
        ),
        responsive: ["sm", "md", "lg", "xl"],
      },
    ];

    if (isMobile) {
      return baseColumns;
    } else {
      return [
        ...baseColumns.slice(0, 2),
        ...desktopColumns,
        ...baseColumns.slice(2),
      ];
    }
  };

  const renderMobileOrderCard = (order) => {
    return (
      <Card
        key={order._id}
        style={{ marginBottom: 16, borderRadius: 8 }}
        actions={[
          <Button
            type="primary"
            onClick={() => showOrderDetails(order)}
            icon={<EyeOutlined />}
            size="small"
          >
            View Items
          </Button>,
          <Select
            value={order.orderStatus}
            onChange={(newStatus) => handleOrderStatus(order._id, newStatus)}
            style={{ width: "100%", maxWidth: 120 }}
            size="small"
          >
            {["Pending", "On The Way", "Delivered", "Cancelled"].map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>,
        ]}
      >
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Text type="secondary">Order ID:</Text>
            <div>
              <Text code>{order._id.slice(-6)}</Text>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Customer:</Text>
            <div>
              <Text strong>{order.user?.name}</Text>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Total:</Text>
            <div>
              <Text strong style={{ color: "#1890ff" }}>
                ${order.totalPrice.toFixed(2)}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Status:</Text>
            <div>
              <Tag
                color={
                  order.orderStatus === "Pending"
                    ? "orange"
                    : order.orderStatus === "On The Way"
                    ? "blue"
                    : order.orderStatus === "Delivered"
                    ? "green"
                    : "red"
                }
              >
                {order.orderStatus}
              </Tag>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Payment:</Text>
            <div>
              <Tag
                color={
                  order.paymentStatus === "paid"
                    ? "green"
                    : order.paymentStatus === "failed"
                    ? "red"
                    : "gold"
                }
              >
                {order.paymentStatus.toUpperCase()}
              </Tag>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary">Date:</Text>
            <div>
              <Text strong style={{ color: "#d48806" }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          padding: isMobile ? "10px" : "20px",
          maxWidth: "100vw",
          overflow: "hidden",
        }}
      >
        <Title
          level={isMobile ? 3 : 2}
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "10px" : "20px",
          }}
        >
          Admin Orders
        </Title>

        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "20px auto" }}
          />
        ) : orders.length === 0 ? (
          <p
            style={{ textAlign: "center", fontSize: "16px", color: "#ff4d4f" }}
          >
            No Orders Found
          </p>
        ) : (
          <Card
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: isMobile ? 0 : undefined,
            }}
            bodyStyle={{ padding: isMobile ? "10px" : "24px" }}
          >
            {isMobile ? (
              // Card-based view for mobile
              <div>{orders.map((order) => renderMobileOrderCard(order))}</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <Table
                  columns={getColumns()}
                  dataSource={orders}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    size: isTablet ? "small" : "default",
                    responsive: true,
                  }}
                  scroll={{ x: isTablet ? 800 : 1000 }}
                  size={isTablet ? "small" : "middle"}
                />
              </div>
            )}
          </Card>
        )}
      </div>

      {isMobile ? (
        <Drawer
          title="Order Items"
          placement="bottom"
          height="80%"
          onClose={() => setModalVisible(false)}
          open={modalVisible}
        >
          {selectedOrder && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Customer: </Text>
                <Text strong>{selectedOrder.user?.name}</Text>
                <Divider style={{ margin: "8px 0" }} />
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Text type="secondary">Order Total: </Text>
                    <Text strong>${selectedOrder.totalPrice.toFixed(2)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Status: </Text>
                    <Tag
                      color={
                        selectedOrder.orderStatus === "Pending"
                          ? "orange"
                          : selectedOrder.orderStatus === "On The Way"
                          ? "blue"
                          : selectedOrder.orderStatus === "Delivered"
                          ? "green"
                          : "red"
                      }
                    >
                      {selectedOrder.orderStatus}
                    </Tag>
                  </Col>
                </Row>
              </div>
              <List
                itemLayout="horizontal"
                dataSource={selectedOrder.orderItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      }
                      title={item.name}
                      description={`Qty: ${item.quantity} × $${item.price}`}
                    />
                    <div>
                      <Text strong>
                        ${(item.quantity * item.price).toFixed(2)}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}
        </Drawer>
      ) : (
        <Modal
          title="Order Details"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={isTablet ? "90%" : "60%"}
        >
          {selectedOrder && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={isTablet ? 24 : 12}>
                    <Text type="secondary">Customer: </Text>
                    <Text strong>
                      {selectedOrder.user?.name} ({selectedOrder.user?.email})
                    </Text>
                  </Col>
                  <Col span={isTablet ? 12 : 6}>
                    <Text type="secondary">Order Total: </Text>
                    <Text strong>${selectedOrder.totalPrice.toFixed(2)}</Text>
                  </Col>
                  <Col span={isTablet ? 12 : 6}>
                    <Text type="secondary">Status: </Text>
                    <Tag
                      color={
                        selectedOrder.orderStatus === "Pending"
                          ? "orange"
                          : selectedOrder.orderStatus === "On The Way"
                          ? "blue"
                          : selectedOrder.orderStatus === "Delivered"
                          ? "green"
                          : "red"
                      }
                    >
                      {selectedOrder.orderStatus}
                    </Tag>
                  </Col>
                </Row>
              </div>
              <List
                itemLayout="horizontal"
                dataSource={selectedOrder.orderItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 50, borderRadius: 5 }}
                        />
                      }
                      title={item.name}
                      description={`Quantity: ${item.quantity} - Price: $${item.price}`}
                    />
                    <div>
                      <Text strong>
                        ${(item.quantity * item.price).toFixed(2)}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

export default GetOrders;
