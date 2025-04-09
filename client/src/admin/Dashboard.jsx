import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../api/API";
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Table,
  Spin,
  Statistic,
  Avatar,
  Tooltip,
  Skeleton,
  Space,
  List,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Navbar from "./AdminNav";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function Dashboard() {
  const [productsLength, setProductLength] = useState(0);
  const [totalUser, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

    useEffect(() => {
        const UserToken = localStorage.getItem("UserToken");
        const AdminToken = localStorage.getItem("AdminToken");
    
        if (AdminToken) {
          navigate("/dashboard");
        } else if (UserToken) {
          navigate("/");
        }
      }, [navigate]);

  const GetOrdersfromDB = async () => {
    try {
      const token = localStorage.getItem("AdminToken");

      const response = await axios.get(url.getPlacedOrders, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalOrders(response.data?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getProducts = async () => {
    try {
      const token = localStorage.getItem("AdminToken");
      if (!token) return;

      const response = await axios.get(url.getProducts, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductLength(response.data?.data?.length || 0);
    } catch (error) {
      console.log("Error getting products:", error);
    }
  };

  const getallUsers = async () => {
    const token = localStorage.getItem("AdminToken");
    try {
      const response = await axios.get(url.getUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalUsers(response.data?.data?.length || 0);
      setUsers(response.data?.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getallUsers();
    getProducts();
    GetOrdersfromDB();
  }, []);

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            icon={<UserOutlined />}
            style={{ marginRight: 12, backgroundColor: "#1890ff" }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{moment(text).format("MMM DD, YYYY")}</span>,
      responsive: ["md"],
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <span
          style={{
            backgroundColor: "#f6ffed",
            color: "#52c41a",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          Active
        </span>
      ),
    },
  ];

  const cardStyles = [
    {
      backgroundColor: "#e6f7ff",
      color: "#1890ff",
      borderLeft: "4px solid #1890ff",
      infoText: "Total number of registered users in the system.",
      icon: <UserOutlined />,
      title: "Total Users",
    },
    {
      backgroundColor: "#f6ffed",
      color: "#52c41a",
      borderLeft: "4px solid #52c41a",
      infoText: "Total products available in inventory.",
      icon: <ShoppingOutlined />,
      title: "Total Products",
    },
    {
      backgroundColor: "#fff7e6",
      color: "#fa8c16",
      borderLeft: "4px solid #fa8c16",
      infoText: "Total orders placed by customers.",
      icon: <ShoppingCartOutlined />,
      title: "Total Orders",
    },
    {
      backgroundColor: "#f9f0ff",
      color: "#722ed1",
      borderLeft: "4px solid #722ed1",
      infoText: "Estimated revenue based on order volume.",
      icon: <DollarOutlined />,
      title: "Sales",
    },
  ];

  const UserListMobile = () => (
    <List
      itemLayout="horizontal"
      dataSource={users.slice(0, 5)}
      renderItem={(user) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
            }
            title={user.name}
            description={
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {user.email}
                </Text>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "4px",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {moment(user.createdAt).format("MMM DD, YYYY")}
                  </Text>
                  <span
                    style={{
                      backgroundColor: "#f6ffed",
                      color: "#52c41a",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    Active
                  </span>
                </div>
              </Space>
            }
          />
        </List.Item>
      )}
      loading={loading}
      locale={{
        emptyText: <Text type="secondary">No users found</Text>,
      }}
    />
  );

  const StatCard = ({ style, icon, title, value, suffix, info, subtext }) => (
    <Card
      style={{
        boxShadow:
          "0 1px 2px -2px rgba(0,0,0,.16), 0 3px 6px 0 rgba(0,0,0,.12), 0 5px 12px 4px rgba(0,0,0,.09)",
        borderRadius: "8px",
        backgroundColor: style.backgroundColor,
        borderLeft: style.borderLeft,
        marginBottom: isMobile ? "16px" : "0",
      }}
      bodyStyle={isMobile ? { padding: "12px" } : {}}
    >
      <Statistic
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "8px", color: style.color }}>
              {title}
            </span>
            <Tooltip title={info}>
              <InfoCircleOutlined style={{ color: style.color }} />
            </Tooltip>
          </div>
        }
        value={value}
        prefix={React.cloneElement(icon, { style: { color: style.color } })}
        valueStyle={{
          color: style.color,
          fontSize: isMobile ? "20px" : "24px",
        }}
        suffix={suffix}
      />
      <Text
        type="secondary"
        style={{
          display: "block",
          marginTop: "8px",
          fontSize: isMobile ? "11px" : "12px",
        }}
      >
        {subtext}
      </Text>
    </Card>
  );

  return (
    <div>
      <Navbar />

      <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
        <Content style={{ padding: isMobile ? "12px" : "24px" }}>
          <Row gutter={[0, isMobile ? 12 : 16]}>
            <Col span={24}>
              <Card
                style={{
                  borderRadius: "8px",
                  marginBottom: isMobile ? "12px" : "16px",
                  backgroundColor: "#fafafa",
                }}
                bodyStyle={isMobile ? { padding: "12px" } : {}}
              >
                <Paragraph>
                  <Title level={isMobile ? 5 : 4} style={{ marginTop: 0 }}>
                    Dashboard Overview
                  </Title>
                  <Text
                    type="secondary"
                    style={{ fontSize: isMobile ? "12px" : "14px" }}
                  >
                    Welcome to your admin dashboard. Here you can view
                    calculation and user activity. Last data update:{" "}
                    {moment().format("MMMM DD, YYYY [at] HH:mm")}
                  </Text>
                </Paragraph>
              </Card>
            </Col>
          </Row>

          {isMobile ? (
            <div style={{ marginBottom: "16px" }}>
              {cardStyles.map((style, index) => (
                <StatCard
                  key={index}
                  style={style}
                  icon={style.icon}
                  title={style.title}
                  value={
                    index === 0
                      ? totalUser
                      : index === 1
                      ? productsLength
                      : index === 2
                      ? totalOrders
                      : totalOrders * 125
                  }
                  suffix={index === 3 ? "Dollar" : null}
                  info={style.infoText}
                  subtext={
                    index === 0
                      ? totalUser > 0
                        ? `${Math.round(
                            (totalUser / 100) * 100
                          )}% growth this month`
                        : "No growth data available"
                      : index === 1
                      ? productsLength > 0
                        ? `${productsLength} products in stock`
                        : "No products in stock"
                      : index === 2
                      ? totalOrders > 0
                        ? `${Math.round(
                            totalOrders * 0.7
                          )} completed, ${Math.round(
                            totalOrders * 0.3
                          )} pending`
                        : "No orders"
                      : totalOrders > 0
                      ? `Average order value: $125`
                      : "No revenue data"
                  }
                />
              ))}
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                  style={cardStyles[0]}
                  icon={cardStyles[0].icon}
                  title={cardStyles[0].title}
                  value={totalUser}
                  info={cardStyles[0].infoText}
                  subtext={
                    totalUser > 0
                      ? `${Math.round(
                          (totalUser / 100) * 100
                        )}% growth this month`
                      : "No growth data available"
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                  style={cardStyles[1]}
                  icon={cardStyles[1].icon}
                  title={cardStyles[1].title}
                  value={productsLength}
                  info={cardStyles[1].infoText}
                  subtext={
                    productsLength > 0
                      ? `${productsLength} products in stock`
                      : "No products in stock"
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                  style={cardStyles[2]}
                  icon={cardStyles[2].icon}
                  title={cardStyles[2].title}
                  value={totalOrders}
                  info={cardStyles[2].infoText}
                  subtext={
                    totalOrders > 0
                      ? `${Math.round(
                          totalOrders * 0.7
                        )} completed, ${Math.round(totalOrders * 0.3)} pending`
                      : "No orders"
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                  style={cardStyles[3]}
                  icon={cardStyles[3].icon}
                  title={cardStyles[3].title}
                  value={totalOrders * 125}
                  suffix="Dollar"
                  info={cardStyles[3].infoText}
                  subtext={
                    totalOrders > 0
                      ? `Average order value: $125`
                      : "No revenue data"
                  }
                />
              </Col>
            </Row>
          )}

          <div style={{ marginTop: isMobile ? 16 : 24 }}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Recent Users</span>
                  <Text
                    type="secondary"
                    style={{ fontSize: isMobile ? "12px" : "14px" }}
                  >
                    Showing {users.length > 5 ? 5 : users.length} of{" "}
                    {users.length} users
                  </Text>
                </div>
              }
              style={{
                borderRadius: "8px",
                boxShadow:
                  "0 1px 2px -2px rgba(0,0,0,.16), 0 3px 6px 0 rgba(0,0,0,.12), 0 5px 12px 4px rgba(0,0,0,.09)",
              }}
              bodyStyle={isMobile ? { padding: "12px" } : {}}
              extra={<a href="#">View All</a>}
            >
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: isMobile ? "30px 0" : "50px 0",
                  }}
                >
                  <Spin size={isMobile ? "default" : "large"} />
                </div>
              ) : (
                <>
                  {isMobile ? (
                    <UserListMobile />
                  ) : (
                    <Table
                      dataSource={users}
                      columns={columns}
                      rowKey="_id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: isTablet ? 500 : true }}
                    />
                  )}
                  <div
                    style={{
                      marginTop: "16px",
                      padding: isMobile ? "12px" : "16px",
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    }}
                  >
                    <Text
                      type="secondary"
                      style={{ fontSize: isMobile ? "12px" : "14px" }}
                    >
                      <InfoCircleOutlined style={{ marginRight: "8px" }} />
                      User registration trends show a{" "}
                      {totalUser > 10 ? "positive" : "steady"} growth pattern in
                      the last 30 days. Most users are active within the first
                      week of registration.
                    </Text>
                  </div>
                </>
              )}
            </Card>
          </div>
        </Content>
      </Layout>
    </div>
  );
}

export default Dashboard;
