const BASE_URL = import.meta.env.VITE_API_URL;

export const url = {
  baseApiUrl: BASE_URL,
  register: `${BASE_URL}api/auth/register`,
  login: `${BASE_URL}api/auth/login`,
  adminRoutes: `${BASE_URL}admin/admin`,
  deleteProduct: `${BASE_URL}admin/admin`,
  uploadImage: `${BASE_URL}api/files/upload/`,
  getProducts: `${BASE_URL}user/products`,
  createOrder: `${BASE_URL}api/orders`,
  getPlacedOrders: `${BASE_URL}api/orders/getOrders`,
  updateOrderStatus: `${BASE_URL}api/orders`,
  getuserOrder: `${BASE_URL}api/orders/myorder`,
  searchProducts: `${BASE_URL}products/search`,
  getUsers: `${BASE_URL}admin/users`,
  findByCategories:`${BASE_URL}products/findCategory`

  // http://localhost:5000/products/findCategory?category=Perfumes
};

// http://localhost:5000/api/files/upload
// http://localhost:5000/admin/admin/67a33e61695d041c6219d62
