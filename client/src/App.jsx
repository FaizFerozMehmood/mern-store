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
import Layout from "./Layout";

function App() {
  const HandleAuth = () => {
    const navigate = useNavigate();
    // let token = Cookies.get("userToken") || Cookies.get("adminToken")
    useEffect(() => {
      const userInfo = Cookies.get("userInfo")
        ? JSON.parse(Cookies.get("userInfo"))
        : null;
      if (userInfo) {
        if (userInfo.role == "admin") {
          return navigate("/image");
        } else if (userInfo.role == "user") {
          return navigate("/");
        }
      }
    }, [navigate]);
    return null;
  };

  return (
    <BrowserRouter>  
      <HandleAuth />
      <Routes>
        <Route path={"/register"} element={<Register />} />
        <Route path={"/layout"} element={<Layout />} />
        <Route path={"/"} element={<Home />} />
        <Route path={"/login"} element={<Login />} />
        {/* <Route path={"/card"} element={<Ca />} /> */}
        <Route path={"/image"} element={<ProductForm />} />
        <Route
          path="/admin"
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
    </BrowserRouter>
  );
}

export default App;
