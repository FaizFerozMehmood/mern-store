import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Layout,
  Menu,
  Badge,
  Drawer,
  Space,
  Typography,
  ConfigProvider,
  Dropdown,
  Tooltip,
  theme,
  Avatar,
  Divider,
} from "antd";
import Cookies from "js-cookie";
import {
  LogoutOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  HomeOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
  UserOutlined,
  DownOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

const Navbar = ({ leng }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();

  const primaryColor = "#2a5637";
  const secondaryColor = "#e4ede6";
  const accentColor = "#ff6b35";
  const headerHeight = 70;
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const userData = Cookies.get("userInfo");
    if (userData) {
      const userInfo = JSON.parse(userData);
      console.log("userINfo", userInfo.name);
      setName(userInfo.name);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem("cartItem")) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    handleCartUpdate();
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, [leng]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleNavigation = (e) => {
    navigate(e.key);
    setIsDrawerOpen(false);
  };

  const handleCartClick = () => {
    navigate("/cartItemsPage");
  };

  const handleLogout = () => {
    Cookies.remove("userInfo");
    localStorage.removeItem("UserToken");
    localStorage.removeItem("AdminToken");
    navigate("/login");
  };

  const menuItems = useMemo(
    () => [
      { key: "/", label: "Home", icon: <HomeOutlined /> },
      { key: "/userOrder", label: "Order", icon: <ShoppingOutlined /> },
      {
        key: "#",
        label: "Services",
        icon: <CustomerServiceOutlined />,
      },
      { key: "/contact", label: "Contact", icon: <PhoneOutlined /> },
    ],
    []
  );

  const userDropdownItems = [
    {
      key: "#",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => navigate(""),
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <ShoppingOutlined />,
      onClick: () => navigate("/userOrder"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  const headerStyle = {
    position: "fixed",
    zIndex: 1000,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: scrolled ? "rgba(228, 237, 230, 0.95)" : secondaryColor,
    padding: isMobile ? "0 16px" : "0 24px",
    boxShadow: scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
    height: `${headerHeight}px`,
    transition: "all 0.3s ease",
    backdropFilter: scrolled ? "blur(8px)" : "none",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  };

  const logoIconStyle = {
    width: "36px",
    height: "36px",
    backgroundColor: primaryColor,
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "12px",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          colorBgBase: secondaryColor,
          borderRadius: 6,
          fontFamily:
            "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
        },
        components: {
          Menu: {
            horizontalItemHoverColor: primaryColor,
            horizontalItemSelectedColor: primaryColor,
            itemHoverColor: primaryColor,
            itemSelectedColor: primaryColor,
          },
          Button: {
            primaryColor: "#fff",
            defaultBg: "transparent",
          },
          Drawer: {
            contentBg: secondaryColor,
          },
        },
      }}
    >
      <Layout>
        <Header style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={
                <MenuOutlined
                  style={{ fontSize: "22px", color: primaryColor }}
                />
              }
              onClick={() => setIsDrawerOpen(true)}
              style={{
                fontSize: "18px",
                display: "none",
                marginRight: "12px",
                border: "none",
                padding: "4px 8px",
              }}
              className="mobile-menu-button"
            />

            <div
              onClick={() => navigate("/")}
              style={logoStyle}
              className="logo-container"
            >
              <div style={logoIconStyle}>
                <ShopOutlined />
              </div>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: primaryColor,
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                  fontSize: isMobile ? "18px" : "24px",
                }}
              >
                MyStore
              </Title>
            </div>
          </div>

          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={handleNavigation}
            style={{
              backgroundColor: "transparent",
              border: "none",
              flex: 1,
              justifyContent: "center",
              marginLeft: "40px",
              marginRight: "40px",
              fontWeight: "500",
            }}
            className="desktop-menu"
            items={menuItems}
          />

          <Space size={isMobile ? "small" : "large"} className="nav-actions">
            <Tooltip title="Shopping Cart">
              <Badge
                count={cartCount}
                color={accentColor}
                size="small"
                offset={[-2, 2]}
              >
                <Button
                  type="text"
                  icon={
                    <ShoppingCartOutlined
                      style={{ fontSize: "22px", color: primaryColor }}
                    />
                  }
                  onClick={handleCartClick}
                  style={{ padding: isMobile ? "4px" : "8px" }}
                  className="cart-button"
                />
              </Badge>
            </Tooltip>

            <div className="desktop-actions">
              <Dropdown
                menu={{ items: userDropdownItems }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <Button
                  type="primary"
                  style={{
                    borderRadius: "6px",
                    backgroundColor: primaryColor,
                    display: "flex",
                    alignItems: "center",
                    height: "36px",
                  }}
                >
                  <Space>
                    <UserOutlined />
                    <span>Account</span>
                    <DownOutlined style={{ fontSize: "12px" }} />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </Space>
        </Header>

        <Drawer
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: primaryColor,
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "12px",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <ShopOutlined />
              </div>
              <Title level={4} style={{ margin: 0, color: primaryColor }}>
                MyStore
              </Title>
            </div>
          }
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={280}
          bodyStyle={{ padding: 0 }}
          headerStyle={{
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
          closeIcon={<MenuOutlined style={{ color: primaryColor }} />}
        >
          <div
            className="drawer-user-info"
            style={{
              padding: "16px",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              backgroundColor: "rgba(42, 86, 55, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <Avatar
                size={40}
                icon={<UserOutlined />}
                style={{ backgroundColor: primaryColor, marginRight: "12px" }}
              />
              <div>
                <Text strong style={{ display: "block" }}>
                  Welcome
                </Text>
                <Text type="secondary">{name}</Text>
              </div>
            </div>

            <Space wrap>
              <Badge count={cartCount} color={accentColor} offset={[-5, 0]}>
                <Button
                  type="default"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => {
                    handleCartClick();
                    setIsDrawerOpen(false);
                  }}
                  style={{
                    borderColor: token.colorBorderSecondary,
                  }}
                >
                  Cart
                </Button>
              </Badge>

              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => {
                  navigate("#");
                  setIsDrawerOpen(false);
                }}
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                Profile
              </Button>
            </Space>
          </div>

          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            onClick={handleNavigation}
            style={{
              border: "none",
              padding: "8px 0",
            }}
            items={menuItems}
          />

          <Divider style={{ margin: "8px 0" }} />

          <div style={{ padding: "16px 24px" }}>
            <Button
              type="primary"
              onClick={handleLogout}
              style={{
                width: "100%",
                backgroundColor: "#f5222d",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              danger
            >
              <LogoutOutlined style={{ marginRight: "8px" }} />
              Logout
            </Button>
          </div>
        </Drawer>

        <Content>
          <div style={{ paddingTop: `${headerHeight}px` }} />
          {/* <p>hello</p> */}
        </Content>

        <style>
          {`
            @media (max-width: 768px) {
              .desktop-menu {
                display: none !important;
              }
              .mobile-menu-button {
                display: block !important;
              }
              .nav-actions {
                margin-left: auto;
              }
              .desktop-actions {
                display: none !important;
              }
              .logo-container:hover {
                transform: translateX(0);
              }
              .logo-container {
                transform: scale(0.9);
              }
            }
            
            @media (min-width: 769px) {
              .mobile-logout {
                display: none !important;
              }
              .logo-container:hover {
                transform: translateX(3px);
              }
            }
            
            /* Fix for very small screens */
            @media (max-width: 359px) {
              .logo-container {
                transform: scale(0.85);
              }
              .ant-layout-header {
                padding: 0 12px !important;
              }
              .ant-space.nav-actions {
                gap: 8px !important;
              }
              .cart-button {
                padding: 4px !important;
              }
            }
            
            /* Smooth transitions */
            .ant-drawer-content-wrapper,
            .ant-menu-item,
            .ant-btn {
              transition: all 0.3s ease !important;
            }
            
            /* Button hover effects */
            .ant-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .cart-button:hover {
              background-color: rgba(42, 86, 55, 0.08) !important;
              border-radius: 50%;
            }
            
            /* Active menu item styling */
            .ant-menu-item-selected {
              font-weight: 600 !important;
              position: relative;
            }
            
            .ant-menu-horizontal > .ant-menu-item-selected::after {
              content: '';
              position: absolute;
              width: 24px;
              height: 3px;
              background: ${primaryColor};
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              border-radius: 3px 3px 0 0;
            }
            
            .ant-menu-vertical > .ant-menu-item-selected {
              background-color: rgba(42, 86, 55, 0.08) !important;
              border-left: 3px solid ${primaryColor};
            }
            
            /* Dropdown menu animations */
            .ant-dropdown-menu-item:hover {
              background-color: rgba(42, 86, 55, 0.08) !important;
            }
            
            /* Badge animation */
            @keyframes badgePulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            
            .ant-badge-count:not(.ant-badge-count-0) {
              animation: badgePulse 2s infinite;
            }
            
            /* Drawer transition */
            .ant-drawer-content {
              border-radius: 0 12px 12px 0;
            }
            
            /* Fix icon alignment */
            .ant-btn .anticon {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            /* Fix for drawer button icons */
            .ant-drawer .ant-btn .anticon {
              margin-right: 8px;
              display: inline-flex;
              vertical-align: middle;
            }
          `}
        </style>
      </Layout>
    </ConfigProvider>
  );
};

export default Navbar;
