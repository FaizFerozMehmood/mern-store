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
} from "antd";
import { url } from "../api/API";
import Navbar from "./AdminNav";

const { Title, Text } = Typography;
const { Option } = Select;

function GetOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Orders from Database
  const GetOrdersfromDB = async () => {
    try {
      const token = localStorage.getItem("AdminToken");
      const response = await axios.get(url.getPlacedOrders, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort orders by date (newest first)
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

  // Update Order Status
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

  const columns = [
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
          {user?.name} ({user?.email})
        </Text>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <Text strong style={{ color: "#1890ff" }}>
          ${price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Payment Status",
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
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status, record) => {
        const colorMap = {
          Pending: "orange",
          "On The Way": "blue",
          Delivered: "green",
          Cancelled: "red",
        };

        return (
          <Space>
            <Tag color={colorMap[status]}>{status}</Tag>
            <Select
              value={status}
              onChange={(newStatus) => handleOrderStatus(record._id, newStatus)}
              style={{ width: 130 }}
            >
              {["Pending", "On The Way", "Delivered", "Cancelled"].map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          </Space>
        );
      },
    },
    {
      title: "Delivery City",
      dataIndex: "orderDeliveryAddress",
      key: "orderDeliveryAddress",
      render: (address) => <Text>{address?.city}</Text>,
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text strong style={{ color: "#d48806" }}>
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => showOrderDetails(record)}>View Items</Button>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ marginTop:"0px",padding: "20px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
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
            }}
          >
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              style={{ fontSize: "16px" }}
            />
          </Card>
        )}
      </div>

      <Modal
        title="Order Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedOrder && (
          <List
            itemLayout="horizontal"
            dataSource={selectedOrder.orderItems} // Fix here
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
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
}

export default GetOrders;
