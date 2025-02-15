


const BASE_URL = "http://localhost:5000/";
export const url = {
  baseApiUrl: BASE_URL,
  register: `${BASE_URL}api/auth/register`,
  login: `${BASE_URL}api/auth/login`, 
  adminRoutes: `${BASE_URL}admin/admin`,
  deleteProduct :`${BASE_URL}admin/admin`,
  uploadImage :`${BASE_URL}api/files/upload/` ,
  getProducts:`${BASE_URL}user/products`
};

// http://localhost:5000/api/files/upload
// http://localhost:5000/admin/admin/67a33e61695d041c6219d62
