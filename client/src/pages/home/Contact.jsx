import React, { useEffect, useState } from "react";
import { Typography, Space, Tooltip, Button, Row, Col, Avatar } from "antd";
import Cookies from "js-cookie";
import {
  GithubOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  MailOutlined,
  GlobalOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const ContactComponent = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const socialLinks = {
    github: "https://github.com/FaizFerozMehmood",
    linkedin: "https://www.linkedin.com/in/faiz-mahmood-b591a42b5/",
    instagram: "https://instagram.com/Faaiz2003",
    whatsapp: "https://wa.me/923169336621",
    email: "mailto:ferozfaaiz5@gmail.com",
    portfolio: "https://yourportfolio.com",
  };

  const handleGoBack = () => {
    const userInfoString = Cookies.get("userInfo");

    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);

        if (userInfo.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed to parse user information.");
      }
    } else {
      navigate("/login");
    }
  };

  const getIconSize = () => {
    if (windowWidth <= 480) return "28px";
    if (windowWidth <= 768) return "30px";
    return "32px";
  };

  const getContainerPadding = () => {
    if (windowWidth <= 480) return "30px 15px";
    if (windowWidth <= 768) return "35px 20px";
    return "40px 20px";
  };

  const getContainerWidth = () => {
    if (windowWidth <= 480) return "95%";
    if (windowWidth <= 768) return "90%";
    if (windowWidth <= 1024) return "85%";
    return "800px";
  };

  const getProfileSize = () => {
    if (windowWidth <= 480) return 100;
    if (windowWidth <= 768) return 120;
    return 140;
  };

  const styles = {
    container: {
      textAlign: "center",
      padding: getContainerPadding(),
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      width: getContainerWidth(),
      maxWidth: "800px",
      margin: "0 auto",
      marginTop: windowWidth <= 480 ? "60px" : "60px",
      marginBottom: "40px",
    },
    profileContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: windowWidth <= 480 ? "20px" : "30px",
    },
    profileImage: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      border: "3px solid #fff",
    },
    title: {
      marginTop: "15px",
      marginBottom: windowWidth <= 480 ? "5px" : "10px",
      color: "#1890ff",
      fontWeight: 600,
      fontSize: windowWidth <= 480 ? "24px" : "30px",
    },
    subtitle: {
      color: "#555",
      fontSize: windowWidth <= 480 ? "14px" : "16px",
      fontWeight: "500",
      marginBottom: windowWidth <= 480 ? "15px" : "20px",
    },
    description: {
      fontSize: windowWidth <= 480 ? "14px" : "16px",
      lineHeight: "1.6",
      color: "#555",
      maxWidth: "600px",
      margin: "0 auto",
      marginBottom: windowWidth <= 480 ? "20px" : "30px",
      padding: windowWidth <= 480 ? "0 10px" : "0",
    },
    iconContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: windowWidth <= 480 ? "20px" : "30px",
    },
    iconWrapper: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      margin: windowWidth <= 480 ? "10px" : "15px",
      transition: "transform 0.3s ease",
      cursor: "pointer",
    },
    icon: {
      fontSize: getIconSize(),
      margin: "0 10px",
      transition: "transform 0.3s ease, color 0.3s",
    },
    label: {
      marginTop: windowWidth <= 480 ? "8px" : "10px",
      fontSize: windowWidth <= 480 ? "12px" : "14px",
      fontWeight: "500",
      color: "#666",
    },
    button: {
      marginTop: windowWidth <= 480 ? "15px" : "20px",
      display: "flex",
      justifyContent: "center",
    },
    footer: {
      color: "#888",
      fontSize: windowWidth <= 480 ? "12px" : "14px",
      marginTop: windowWidth <= 480 ? "15px" : "20px",
      padding: "0 10px",
    },
  };

  const socialMediaData = [
    {
      name: "GitHub",
      icon: <GithubOutlined style={{ ...styles.icon, color: "#333" }} />,
      link: socialLinks.github,
      tooltip: "Check out my GitHub projects",
    },
    {
      name: "LinkedIn",
      icon: <LinkedinOutlined style={{ ...styles.icon, color: "#0077b5" }} />,
      link: socialLinks.linkedin,
      tooltip: "Connect with me on LinkedIn",
    },
    {
      name: "Instagram",
      icon: <InstagramOutlined style={{ ...styles.icon, color: "#e4405f" }} />,
      link: socialLinks.instagram,
      tooltip: "Follow me on Instagram",
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppOutlined style={{ ...styles.icon, color: "#25D366" }} />,
      link: socialLinks.whatsapp,
      tooltip: "Message me on WhatsApp",
    },
    {
      name: "Email",
      icon: <MailOutlined style={{ ...styles.icon, color: "#D44638" }} />,
      link: socialLinks.email,
      tooltip: "Send me an email",
    },
    {
      name: "Portfolio",
      icon: <GlobalOutlined style={{ ...styles.icon, color: "#1890ff" }} />,
      link: socialLinks.portfolio,
      tooltip: "Visit my portfolio",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.profileContainer}>
        <Avatar 
          size={getProfileSize()} 
           src={"/unnamed.jpg"}
          alt="Faiz Mahmood" 
          style={styles.profileImage}
        />
        <Title level={windowWidth <= 480 ? 3 : 2} style={styles.title}>
          Faiz Mahmood
        </Title>
        <div style={styles.subtitle}>MERN Stack Developer</div>
      </div>

      <Paragraph style={styles.description}>
        Hi, I'm a passionate developer always open for
        collaboration, new opportunities, and interesting projects. Feel free to
        reach out through any of these platforms.
      </Paragraph>

      <Row justify="center" style={styles.iconContainer}>
        {socialMediaData.map((item, index) => (
          <Col key={index} xs={12} sm={8} md={6} lg={4}>
            <Tooltip title={item.tooltip}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.iconWrapper}
              >
                {item.icon}
                <span style={styles.label}>{item.name}</span>
              </a>
            </Tooltip>
          </Col>
        ))}
      </Row>

      <div style={styles.button}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          size={windowWidth <= 480 ? "middle" : "large"}
          onClick={handleGoBack}
        >
          Go Back
        </Button>
      </div>

      <Paragraph style={styles.footer}>
        Let's build something amazing together!
      </Paragraph>
    </div>
  );
};

export default ContactComponent;