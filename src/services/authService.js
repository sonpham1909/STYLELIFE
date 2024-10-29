import axios from 'axios';

const API_URL = 'http://192.168.1.13:3000/v1/auth';

// Đăng ký
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Đăng nhập
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export default {
  register,
  login,
};
