import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { url } from "../../api/API";
import Cookies from "js-cookie";
import { Button, Card, Col, Row, Typography, Spin } from "antd";

const { Title, Text } = Typography;

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const getProducts = async () => {
    try {
      const token = Cookies.get("userToken");
      setLoading(true);
      const response = await axios.get(url.getProducts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setData(response.data?.data);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const navigate = useNavigate();
  

  const handleLogout = () => {
    cookies.remove("userInfo");
    cookies.remove("adminToken");
    cookies.remove("userToken");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const userInfo = Cookies.get("userInfo")
    const token = cookies.get("adminToken");
    try {
      const response = await axios.delete(`${url.deleteProduct}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

       if(userInfo.role !=="admin"){
        // setData(data.filter(value))=> value.id !==id)
        // setData(data.filter((value) => value._id !== id));
        console.log("not allowed!");
        

       }
       
      console.log(response.data);
    } catch (error) {
      console.log("error deleting product", error);
    }
  };
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Logout Button */}
      <Button
        type="primary"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Logout
      </Button>

      {/* Product List */}
      <Row gutter={[16, 16]} justify="center">
        {loading ? (
          <Spin size="large" />
        ) : data.length > 0 ? (
          data.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={product.image}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                }
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <Title level={4}>{product.title}</Title>
                <Text strong style={{ display: "block", marginBottom: "10px" }}>
                  ${product.price}
                </Text>
                <Text type="secondary">{product.des}</Text>
                {/* <button > */}
                <DeleteOutlined
                  onClick={() => handleDelete(product._id)}
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "20px",
                    color: "red",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                />
                {/* </button> */}
              </Card>
            </Col>
          ))
        ) : (
          <Text type="danger">No products found!</Text>
        )}
      </Row>
    </div>
  );
}

export default Home;
