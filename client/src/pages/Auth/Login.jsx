import React, { useEffect, useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin } from "antd";
import { url } from "../../api/API";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const UserToken = localStorage.getItem("UserToken");
    const AdminToken = localStorage.getItem("AdminToken");
    if (UserToken) {
      navigate("/");
    } else if (AdminToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setIsLoading(true);

    const loginData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post(url.login, loginData);
      form.resetFields();

      Cookies.set("userInfo", JSON.stringify(response.data?.data?.user), {
        expires: 7,
      });

      const user = response.data?.data?.user;
      const token = response.data?.data?.token;

      if (user?.role === "admin") {
        localStorage.setItem("AdminToken", token);
      } else {
        localStorage.setItem("UserToken", token);
      }

      if (response.status === 200) {
        toast.success(`Welcome to the page!`);

        if (user?.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Login</h2>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={<MailOutlined style={styles.icon} />}
              placeholder="Email"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined style={styles.icon} />}
              type="password"
              placeholder="Password"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              style={styles.button}
            >
              {isLoading ? <Spin size="small" /> : "Log in"}
            </Button>
          </Form.Item>

          <p style={styles.registerText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.registerLink}>
              Register now!
            </Link>
          </p>
        </Form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  formWrapper: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  icon: {
    color: "#888",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    height: "40px",
    fontSize: "16px",
    backgroundColor: "black",
  },
  registerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  },
  registerLink: {
    color: "#1890ff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;
