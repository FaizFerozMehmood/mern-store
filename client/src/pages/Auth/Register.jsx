import React, { useState } from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin } from "antd";
import { url } from "../../api/API";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // console.log("received values of form: ", values);
    setIsLoading(true);
    const regiserData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    localStorage.setItem("userName",regiserData.name)

    
    try {
      const response = await axios.post(url.register, regiserData);
      toast.success(response.data?.msg);
      form.resetFields();
      if (response.status === 201) {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Create an Account</h2>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input
              prefix={<UserOutlined style={styles.icon} />}
              placeholder="Name"
              style={styles.input}
            />
          </Form.Item>
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
              {isLoading ? <Spin size="small" /> : "Register"}
            </Button>
          </Form.Item>

          <p style={styles.registerText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.registerLink}>
              Login now!
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
}
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

export default Register;
