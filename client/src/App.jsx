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
import UserOrders from "./pages/home/OrderSuccess.jsx";
import ProductCart from "./admin/ProductCart.jsx";
import ContactComponent from "./pages/home/Contact.jsx";
import Dashboard from "./admin/Dashboard.jsx";
 const token = localStorage.getItem("UserToken");
function App() {
  // making changes to push to github

  

  return (
    
      <div
        // style={{
        //   margin: "0px",
        //   padding: "0px",
        //   boxSizing: "border-box",
        // }}
      >
        <Routes>

          <Route path={"/register"}  element={<Register />} />
          <Route path={"/"} element={<Home />} />
          <Route path={"/cartItemsPage"} element={<CartItemsDetails />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/dashboard"} element={<Dashboard />} />
          <Route path={"/AdminNav"} element={<AdminNav />} />
          <Route path={"/navbar"} element={<Navbar />} />

          <Route path={"/contact"} element={<ContactComponent />} />
          <Route path={"/admin"} element={<ProductForm />} />
          <Route path={"/adminProduct"} element={<ProductCart />} />
          <Route path={"/getOrders"} element={<GetOrders />} />
          <Route path={"/userOrder"} element={<UserOrders />} />
          <Route
            path="/header"
            element={
              <AdminProtectedRoutes>
                <HeaderComp />
              </AdminProtectedRoutes>
            }
          />
        </Routes>
      </div>
   
  );
}

export default App;
