import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/home/Home";
import HeaderComp from "./pages/Header";
import { useEffect } from "react";
import Cookies from "js-cookie";
import AdminProtectedRoutes from "./admin/adminRoutes";
import ProductForm from "./admin/Upload";
import Navbar from "./pages/home/Navbar";
import CartItemsDetails from "./pages/home/CartItemsDetails.jsx";
import GetOrders from "./admin/GetOrders.jsx";
import AdminNav from "./admin/AdminNav.jsx";
// import CheckOrder from "./pages/home/CheckOrder.jsx";
import UserOrders from "./pages/home/OrderSuccess.jsx";
import ProductCart from "./admin/ProductCart.jsx";

function App() {
  // const HandleAuth = () => {
  //   const navigate = useNavigate();
  //   // let token = Cookies.get("userToken") || Cookies.get("adminToken")
  //   useEffect(() => {
  //     const userInfo = Cookies.get("userInfo")
  //       ? JSON.parse(Cookies.get("userInfo"))
  //       : null;
  //     if (userInfo) {
  //       if (userInfo.role == "admin") {
  //         return navigate("/image");
  //       } else if (userInfo.role == "user") {
  //         return navigate("/cartItemsPage");
  //       }
  //     }
  //   }, [navigate]);
  //   return null;
  // };

  return (
    <BrowserRouter
    >
      <div style={{
        margin:"0px",
        padding:"0px",
        boxSizing:"border-box"
      }}>

      {/* <HandleAuth /> */}
      <Routes>
        <Route path={"/register"} element={<Register />} />
        <Route path={"/"} element={<Home />} />
        <Route path={"/cartItemsPage"} element={<CartItemsDetails />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/AdminNav"} element={<AdminNav />} />
        <Route path={"/navbar"} element={<Navbar />} />

        {/* <Route path={"/card"} element={<Ca />} /> */}
        <Route path={"/admin"} element={<ProductForm />} />
        <Route path={"/adminProduct"} element={<ProductCart />} />
        <Route path={"/getOrders"} element={<GetOrders />} />
        {/* <Route path={"/UserOrders"} element={<UserOrders />} /> */}
        {/* <Route path={"/checkorder"} element={<CheckOrder />} /> */}
        <Route path={"/userOrder"} element={<UserOrders />} />
        {/* <Route path={"/header"} element={<HeaderComp />} /> */}
        <Route
          path="/header"
          element={
            <AdminProtectedRoutes>
              <HeaderComp />
            </AdminProtectedRoutes>
          }
        />
        {/* <Route
          path="/image"
          element={
            <AdminProtectedRoutes>
              <ProductForm />
            </AdminProtectedRoutes>
          }
        /> */}
      </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
