import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, Avatar, Badge, Drawer } from "antd";
import {
  LogoutOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = ({ leng }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItem")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [leng]);

  const handleNavigation = (e) => {
    navigate(e.key);
    setIsDrawerOpen(false); // Close drawer after clicking a menu item
  };

  const handleCartClick = () => {
    navigate("/cartItemsPage");
  };

  const handleLogout = () => {
    cookies.remove("userInfo");
    localStorage.removeItem("UserToken");
    localStorage.removeItem("AdminToken");
    navigate("/login");
  };

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
          padding: "0 15px",
        }}
      >
        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setIsDrawerOpen(true)}
          style={{
            display: "none",
            fontSize: "20px",
            marginBottom: "30px",
          }}
          className="menu-button"
        />

        {/* Logo */}
        <div
          style={{
            color: "black",
            fontSize: "20px",
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
          }}
        >
          MyStore
        </div>

        {/* Desktop Menu */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["/"]}
          onClick={handleNavigation}
          style={{
            flex: 3,
            backgroundColor: "rgba(228, 237, 230)",
          }}
          className="desktop-menu"
          items={[
            { key: "/", label: "Home" },
            { key: "/userOrder", label: "Order" },
            { key: "/services", label: "Services" },
            { key: "/contact", label: "Contact" },
          ]}
        />

        {/* Cart and Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button type="text" onClick={handleCartClick}>
            <Badge count={cartCount} showZero>
              <Avatar
                style={{ backgroundColor: "black" }}
                shape="square"
                size="middle"
                icon={<ShoppingCartOutlined />}
              />
            </Badge>
          </Button>

          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              borderRadius: "20px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Logout
          </Button>
        </div>
      </Header>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Menu
          mode="vertical"
          onClick={handleNavigation}
          items={[
            { key: "/", label: "Home" },
            { key: "/userOrder", label: "Order" },
            { key: "/services", label: "Services" },
            { key: "/contact", label: "Contact" },
          ]}
        />
      </Drawer>

      {/* CSS for responsiveness */}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-menu {
              display: none;
            }
            .menu-button {
              display: block !important;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default Navbar;
