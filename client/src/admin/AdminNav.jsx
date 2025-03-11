import { useState, useEffect } from "react";
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, Drawer, Button } from "antd";
import "antd/dist/reset.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Header } = Layout;

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
    { key: "4", label: "Services" },
    { key: "5", label: "Contact" },
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
          backgroundColor: "rgba(228, 237, 230)",
          padding: "0 20px",
        }}
      >
        {isMobile ? (
          <Button
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
            style={{
              backgroundColor: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          />
        ) : (
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: "rgba(228, 237, 230)",
              display: "flex",
              justifyContent: "center",
            }}
          />
        )}

        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            borderRadius: "20px",
            backgroundColor: "black",
            color: "white",
            marginLeft: "20px",
          }}
        >
          Logout
        </Button>
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        bodyStyle={{
          backgroundColor: "rgba(228, 237, 230)",
        }}
      >
        <Menu mode="vertical" items={menuItems} />
      </Drawer>
    </Layout>
  );
};

export default Navbar;
