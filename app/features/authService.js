import axios from "axios";
import { baseUrl } from "../constants/axiosConfig";

const register = async (data) => {
  const response = await axios.post(`${baseUrl}/auth/register`, data);
  console.log(response.data);
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${baseUrl}/auth/login`, data);
  console.log(response.data);

  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;
