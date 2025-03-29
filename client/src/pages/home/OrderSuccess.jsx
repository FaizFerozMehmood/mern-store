import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Spin, Typography, Card, Space } from "antd";
import { url } from "../../api/API";
import Navbar from "./Navbar";
// import { url } from "../api/API";
// import Navbar from "./UserNav";

const { Title, Text } = Typography;

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text code>{id.slice(-6)}</Text>,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => <Text strong>${price.toFixed(2)}</Text>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "paid" ? "green" : "gold"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const colorMap = {
          Pending: "orange",
          "On The Way": "blue",
          Delivered: "green",
          Cancelled: "red",
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Title level={2}>My Orders</Title>

        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : orders.length === 0 ? (
          <div style={{
            display:"flex",
            justifyContent:"center",
            marginTop:"190px"
          }}>
          <p style={{
            fontFamily:"monospace",
            fontSize:"15px"
          }}>No Orders Found, Order now!</p>

          </div>
        ) : (
          <Table columns={columns} dataSource={orders} rowKey="_id" />
        )}
      </div>
    </div>
  );
}

export default UserOrders;
