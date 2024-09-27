import axios from "axios";
import { baseUrl } from "../../constants/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const register = async (data) => {
  const response = await axios.post(`${baseUrl}/auth/register`, data);
  console.log(response.data);
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${baseUrl}/auth/login`, data);
  await AsyncStorage.setItem("user", JSON.stringify(response.data));

  console.log(response.data);

  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;
