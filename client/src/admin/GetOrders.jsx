import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Spin, Typography, Card, Space } from "antd";
import { url } from "../api/API";

const { Title, Text } = Typography;

function GetOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetOrdersfromDB = async () => {
    try {
      const token = localStorage.getItem("AdminToken");
      const response = await axios.get(url.getPlacedOrders, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetOrdersfromDB();
  }, []);

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
      render: (price) => <Text strong>${price.toFixed(2)}</Text>,
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
      title: "Delivery City",
      dataIndex: "orderDeliveryAddress",
      key: "orderDeliveryAddress",
      render: (address) => <Text>{address?.city}</Text>,
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Admin Orders</Title>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          expandable={{
            expandedRowRender: (order) => (
              <Card style={{ background: "#f9f9f9", borderRadius: "10px" }}>
                <Title level={5}>Order Items:</Title>
                {order.orderItems.map((item) => (
                  <Card.Grid
                    key={item._id}
                    style={{ width: "100%", padding: "10px", border: "none" }}
                  >
                    <Space>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "5px",
                        }}
                      />
                      <Text strong>{item.name}</Text> -{" "}
                      <Text>
                        ${item.price} x {item.quantity}
                      </Text>
                    </Space>
                  </Card.Grid>
                ))}

                <Title level={5} style={{ marginTop: "15px" }}>
                  Delivery Address:
                </Title>
                <Text>
                  {order.orderDeliveryAddress.fullName},{" "}
                  {order.orderDeliveryAddress.phone}
                </Text>
                <br />
                <Text>
                  {order.orderDeliveryAddress.address},{" "}
                  {order.orderDeliveryAddress.city}
                </Text>
              </Card>
            ),
          }}
        />
      )}
    </div>
  );
}

export default GetOrders;
