import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { url } from "../../api/API";
import { useNavigate } from "react-router-dom";
import {
  MinusSquareOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import {
  Button,
  Table,
  Typography,
  message,
  Input,
  Card,
  Empty,
  Spin,
  Divider,
} from "antd";
import Navbar from "./Navbar";

const { Title, Text, Paragraph } = Typography;

function CartItemsDetails() {
  const [items, setItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    setLoading(true);
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
      setCart(cartItems);

      if (cartItems.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(url.getProducts);
      const filteredProducts = response.data?.data.filter((product) =>
        cartItems.some((cartItem) => cartItem.id === product._id)
      );

      setItems(filteredProducts);
    } catch (error) {
      message.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleQuantityChange = (id, type) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity:
            type === "increase"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1),
        };
      }
      return item;
    });

    localStorage.setItem("cartItem", JSON.stringify(updatedCart));
    setCart(updatedCart);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: updatedCart.find((c) => c.id === id)?.quantity || 1,
            }
          : item
      )
    );
  };

  const onRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cartItem", JSON.stringify(updatedCart));
    setCart(updatedCart);
    fetchCartDetails();
    message.success("Item removed from cart");
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const product = items.find((p) => p._id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [cart, items]);

  const handleCustomerDetails = async () => {
    try {
      if (!fullName || !phone || !city || !address) {
        message.warning(
          "Please fill in all delivery details before submitting."
        );
        return;
      }

      const orderDeliveryAddress = {
        fullName,
        phone,
        city,
        address,
      };

      const userInfo = Cookies.get("userInfo")
        ? JSON.parse(Cookies.get("userInfo"))
        : null;
      const userToken = localStorage.getItem("UserToken");

      if (!userInfo || !userInfo._id) {
        message.error("User not found. Please log in again.");
        return;
      }

      if (!userToken) {
        message.error("Authentication failed. Please log in again.");
        return;
      }

      setLoading(true);

      const orderItems = cart.map((cartItem) => {
        const product = items.find((p) => p._id === cartItem.id);
        return {
          product: cartItem.id,
          name: product?.productName || "Unknown",
          quantity: cartItem.quantity,
          image: product?.image || "",
          price: product?.price || 0,
        };
      });

      const response = await axios.post(
        url.createOrder,
        {
          orderItems,
          orderDeliveryAddress,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      setTimeout(() => {
        message.success(
          "Thank you for placing your order! You will receive a confirmation call shortly before delivery.",
          9
        );
        localStorage.removeItem("cartItem");
        setCart([]);
        setItems([]);
        navigate("/userOrder");
      }, 2000);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text}
          alt="product"
          style={{
            height: "70px",
            width: "70px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <Text type="success" strong>
          ${text}
        </Text>
      ),
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => {
        const cartItem = cart.find((item) => item.id === record._id) || {
          quantity: 1,
        };
        return (
          <div className="quantity-control">
            <div style={{ display: "flex", alignItems: "center" }}>
              <MinusSquareOutlined
                onClick={() => handleQuantityChange(record._id, "decrease")}
                style={{
                  fontSize: "22px",
                  cursor: "pointer",
                  marginRight: "8px",
                  color: "#1890ff",
                }}
              />
              <Text strong style={{ margin: "0 8px", fontSize: "16px" }}>
                {cartItem.quantity}
              </Text>
              <PlusSquareOutlined
                onClick={() => handleQuantityChange(record._id, "increase")}
                style={{
                  fontSize: "22px",
                  cursor: "pointer",
                  marginLeft: "8px",
                  color: "#1890ff",
                }}
              />
              <Button
                type="text"
                icon={
                  <DeleteOutlined
                    style={{
                      fontSize: "22px",
                      color: "#ff4d4f",
                    }}
                  />
                }
                onClick={() => onRemove(record._id)}
                danger
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Title level={2} style={{ color: "#1890ff" }}>
          <ShoppingCartOutlined style={{ marginRight: "10px" }} />
          Your Shopping Cart
        </Title>
        <Paragraph type="secondary">
          Review your items, adjust quantities or remove products before
          checkout
        </Paragraph>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          size="large"
          onClick={handleContinueShopping}
          style={{
            backgroundColor: "#262626",
            borderColor: "#262626",
            borderRadius: "6px",
            height: "auto",
            padding: "8px 20px",
          }}
        >
          Continue Shopping
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: "20px" }}>
            Loading your cart...
          </Paragraph>
        </div>
      ) : items.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: "40px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <Empty
            description="Your cart is empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            onClick={handleContinueShopping}
            style={{ marginTop: "20px", backgroundColor: "#1890ff" }}
          >
            Start Shopping
          </Button>
        </Card>
      ) : (
        <>
          <Card
            className="cart-table"
            style={{
              borderRadius: "8px",
              marginBottom: "30px",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <Table
                dataSource={items}
                columns={columns}
                rowKey="_id"
                pagination={false}
                style={{ minWidth: "600px" }}
              />
            </div>

            <div
              style={{
                textAlign: "right",
                padding: "16px",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Title level={4}>
                Total:{" "}
                <span style={{ color: "#1890ff" }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </Title>
            </div>
          </Card>

          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserOutlined
                  style={{ fontSize: "20px", marginRight: "10px" }}
                />
                <span>Delivery Information</span>
              </div>
            }
            style={{ borderRadius: "8px", marginBottom: "30px" }}
          >
            <Paragraph style={{ marginBottom: "20px" }}>
              Please provide your delivery details to complete your order. All
              fields are required.
            </Paragraph>

            <div
              className="form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              <Input
                size="large"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              />
              <Input
                size="large"
                value={phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
                placeholder="Phone Number"
                prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              />
              <Input
                size="large"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                prefix={<HomeOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              />
              <Input
                size="large"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full Delivery Address"
                prefix={<HomeOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              />
            </div>
          </Card>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          >
            <Button
              type="primary"
              size="large"
              onClick={handleCustomerDetails}
              loading={loading}
              style={{
                height: "auto",
                padding: "12px 40px",
                fontSize: "16px",
                borderRadius: "6px",
                backgroundColor: "#262626",
                borderColor: "#262626",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              Complete Order
            </Button>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Text type="secondary">
              By placing your order, you agree to our terms and conditions.
            </Text>
          </div>
        </>
      )}
    </div>
  );
}

export default CartItemsDetails;
