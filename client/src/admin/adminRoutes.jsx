import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";



const AdminProtectedRoutes = ({children})=>{
    const userdata = Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null;

  console.log("userdata", userdata.role);
  if(!userdata || userdata.role !=="admin"){
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default AdminProtectedRoutes