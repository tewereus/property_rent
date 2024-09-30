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

const toggleDarkMode = async (data) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.put(`${baseUrl}/auth/dark-mode`, data, {
    headers,
    withCredentials: true,
  });

  return response.data;
};

const verifySeller = async () => {
  console.log("here");
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.put(`${baseUrl}/auth/verify-seller`, null, {
    headers,
    withCredentials: true,
  });

  return response.data;
};

const authService = {
  register,
  login,
  toggleDarkMode,
  verifySeller,
};

export default authService;
