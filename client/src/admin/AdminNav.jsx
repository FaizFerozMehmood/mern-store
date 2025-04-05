import { useState, useEffect } from "react";
import {
  MenuOutlined,
  LogoutOutlined,
  CloseOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Drawer, Button, Typography } from "antd";
import "antd/dist/reset.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("userInfo");
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "1", label: <Link to="/getOrders">Orders</Link> },
    { key: "2", label: <Link to="/admin">Upload Products</Link> },
    { key: "3", label: <Link to="/adminProduct">Products</Link> },
    { key: "4", label: <Link to="#">Services</Link> },
    { key: "5", label: <Link to="/contact">Contact</Link> },
  ];

  return (
    <Layout>
      <Header
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgba(228, 237, 230)",
          padding: "0 20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          height: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="#"
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <HomeOutlined style={{ fontSize: "20px", color: "#2e7d32" }} />
            <Title level={4} style={{ margin: "0 0 0 10px", color: "#2e7d32" }}>
              Dashboard
            </Title>
          </Link>
        </div>

        {!isMobile && (
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: "rgba(228, 237, 230)",
              display: "flex",
              justifyContent: "center",
              border: "none",
            }}
            selectedKeys={[]}
          />
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              borderRadius: "20px",
              backgroundColor: "black",
              color: "white",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              transition: "background-color 0.3s",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#333")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "black")
            }
          >
            Logout
          </Button>

          {isMobile && (
            <Button
              icon={<MenuOutlined />}
              onClick={() => setVisible(true)}
              style={{
                backgroundColor: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginLeft: "12px",
                height: "36px",
                width: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#333")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "black")
              }
            />
          )}
        </div>
      </Header>

      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Menu</span>
            <Button
              icon={<CloseOutlined />}
              onClick={() => setVisible(false)}
              type="text"
              style={{ color: "#666" }}
            />
          </div>
        }
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        closable={false}
        bodyStyle={{
          backgroundColor: "rgba(228, 237, 230)",
          padding: "12px 0",
        }}
        width={280}
      >
        <Menu
          mode="vertical"
          items={menuItems.map((item) => ({
            ...item,
            label: (
              <Link
                to={item.label.props.to}
                onClick={() => setVisible(false)}
                style={{ display: "block", padding: "4px 0" }}
              >
                {item.label.props.children}
              </Link>
            ),
          }))}
          style={{
            backgroundColor: "rgba(228, 237, 230)",
            border: "none",
          }}
        />
      </Drawer>

      <div style={{ paddingTop: "64px" }}></div>
    </Layout>
  );
};

export default Navbar;
