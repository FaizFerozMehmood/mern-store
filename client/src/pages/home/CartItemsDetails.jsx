import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { url } from "../../api/API";
import { useNavigate } from "react-router-dom";
import {
  MinusSquareOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import { Button, Table, Typography, message, Input } from "antd";
import Navbar from "./Navbar";

const { Title, Text } = Typography;

function CartItemsDetails() {
  const [items, setItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItem")) || [];
      setCart(cartItems);

      if (cartItems.length === 0) {
        setItems([]);
        return;
      }

      const response = await axios.get(url.getProducts);
      const filteredProducts = response.data?.data.filter((product) =>
        cartItems.some((cartItem) => cartItem.id === product._id)
      );

      setItems(filteredProducts);
    } catch (error) {
      message.error("Failed to load cart items");
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
        message.warning("Please fill in all details before submitting.");
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

      message.success("Order placed successfully!");
      localStorage.removeItem("cartItem");
      setCart([]);
      setItems([]);
      navigate("/checkorder");
    } catch (error) {
      console.error(
        "Error placing order",
        error.response?.data || error.message
      );
      message.error(error.response?.data?.message || "Failed to place order");
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img src={text} alt="product" style={{ height: "50px" }} />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => {
        const cartItem = cart.find((item) => item.id === record._id) || {
          quantity: 1,
        };
        return (
          <div
            style={{
              margin: "0px",
            }}
          >
            {/* <Navbar/> */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <MinusSquareOutlined
                onClick={() => handleQuantityChange(record._id, "decrease")}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  marginRight: "3px",
                }}
              />
              <Text>{cartItem.quantity}</Text>
              <PlusSquareOutlined
                onClick={() => handleQuantityChange(record._id, "increase")}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  marginLeft:"3px" ,
                }}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => onRemove(record._id)}
                danger
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          style={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "5px",
            padding: "20px ",
          }}
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </Button>
      </div>

      <Table
        dataSource={items}
        columns={columns}
        rowKey="_id"
        pagination={false}
        style={{ marginTop: "20px" }}
      />

      <Title level={3} style={{ marginTop: "20px" }}>
        Total: ${totalPrice.toFixed(2)}
      </Title>

      <div>
        <Input
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          placeholder="Full Name"
          style={{ margin: "10px 0" }}
        />
        <Input
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="number"
          placeholder="Phone"
          style={{ margin: "10px 0" }}
        />
        <Input
          onChange={(e) => setCity(e.target.value)}
          type="text"
          placeholder="City"
          style={{ margin: "10px 0" }}
        />
        <Input
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          placeholder="Delivery Address"
          style={{ margin: "10px 0" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={handleCustomerDetails}
          style={{
            marginTop: "20px",
            padding: "20px 100px",

            backgroundColor: "black",
            color: "white",
          }}
        >
          Submit Order
        </Button>
      </div>
    </div>
  );
}

export default CartItemsDetails;
