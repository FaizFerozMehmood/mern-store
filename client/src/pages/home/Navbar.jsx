import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, Space, Avatar, Badge } from "antd";
import { LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItem")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  const handleNavigation = (e) => {
    e.domEvent.preventDefault();
    navigate(e.key);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    // if(cartCount.length ==0){
    //  return alert("Add something & try to navigate!")
    // }
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
            { key: "/userOrder", label: "Order" },
            { key: "/services", label: "Services" },
            { key: "/contact", label: "Contact" },
          ]}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Button
            type="text"
            onClick={handleCartClick}
            style={{ cursor: "pointer", border: "none" }}
          >
            <Badge count={cartCount} showZero>
              <Avatar
                style={{ cursor: "pointer", backgroundColor: "black" }}
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
    </Layout>
  );
};

export default Navbar;
