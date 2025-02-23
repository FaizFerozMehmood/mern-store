import { useState, useEffect } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Layout, Menu, Drawer, Button } from "antd";
import "antd/dist/reset.css";
import { Link } from "react-router-dom";
// import "./Navbar.css";

const { Header } = Layout;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const menuItems = [
    { key: "1", label: <Link to="/getOrders">Orders</Link> },
    { key: "2", label: "About" },
    { key: "3", label: "Services" },
    { key: "4", label: "Contact" },
  ];

  return (
    <Layout>
      <Header className="navbar-header">
        {/* <div className="navbar-brand">MyStore</div> */}
        
        {isMobile ? (
          <Button icon={<MenuOutlined />} onClick={showDrawer} className="navbar-menu-button" />
        ) : (
          <Menu mode="horizontal" items={menuItems} className="navbar-menu" />
        )}
      </Header>
      
      <Drawer title="Menu" placement="right" onClose={closeDrawer} open={visible}>
        <Menu mode="vertical" items={menuItems} />
      </Drawer>
    </Layout>
  );
};

export default Navbar;
