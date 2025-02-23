import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, Space, Avatar, Badge } from "antd";
import { LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  console.log("Navigate function:", navigate);


  // Load cart items
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItem")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  // Handle Menu Navigation
  const handleNavigation = (e) => {
    e.domEvent.preventDefault(); // Prevent default refresh behavior
    navigate(e.key);
  };

  // Handle Cart Navigation
  const handleCartClick = (e) => {
    e.preventDefault(); // Prevent any default action
    navigate("/cartItemsPage");
  };

  // Handle Logout
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
        }}
      >
        {/* Logo */}
        <div
          className="logo"
          style={{
            backgroundColor: "rgba(228, 237, 230)",
            color: "black",
            fontSize: "20px",
            fontWeight: "bold",
            marginRight: "20px",
          }}
        >
          MyStore
        </div>

        {/* Navigation Menu (Using `items` instead of `children`) */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["/"]}
          onClick={handleNavigation}
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: "rgba(228, 237, 230)",
          }}
          items={[
            { key: "/", label: "Home" },
            { key: "/about", label: "About" },
            { key: "/services", label: "Services" },
            { key: "/contact", label: "Contact" },
          ]}
        />

        {/* Right Section (Cart + Logout) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Cart Button */}
          <Button type="text" onClick={handleCartClick} style={{ cursor: "pointer", border: "none" }}>
            <Badge count={cartCount} showZero>
              <Avatar style={{ cursor: "pointer", backgroundColor: "black" }} shape="square" size="middle" icon={<ShoppingCartOutlined />} />
            </Badge>
          </Button>

          {/* Logout Button */}
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
    </Layout>
  );
};

export default Navbar;
