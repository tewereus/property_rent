import axios from "axios";
import { baseUrl } from "../../constants/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthToken = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  return user?.token || "";
};

const register = async (data) => {
  const response = await axios.post(`${baseUrl}/auth/register`, data);
  console.log(response.data);
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${baseUrl}/auth/login`, data);
  await AsyncStorage.setItem("user", JSON.stringify(response.data));

  console.log("user data: ", response.data);

  return response.data;
};

const toggleDarkMode = async (data) => {
  // console.log(data);
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

const updateUser = async (data) => {
  const token = getAuthToken();
  const response = await axios.put(`${baseUrl}/auth/update-user`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const verifySeller = async () => {
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

const addToWishlist = async (data) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.put(`${baseUrl}/auth/add-wishlist`, data, {
    headers,
    withCredentials: true,
  });

  return response.data;
};

const getWishlists = async () => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.get(`${baseUrl}/auth/all-wishlists`, {
    headers,
    withCredentials: true,
  });

  return response.data;
};

const changeMode = async (data) => {
  console.log(data);
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.put(`${baseUrl}/auth/change-mode`, data, {
    headers,
    withCredentials: true,
  });

  return response.data;
};

const changeLanguageMode = async (data) => {
  // console.log(data);
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.put(`${baseUrl}/auth/change-language`, data, {
    headers,
    withCredentials: true,
  });

  return response.data;
};

const authService = {
  register,
  login,
  updateUser,
  toggleDarkMode,
  verifySeller,
  addToWishlist,
  getWishlists,
  changeMode,
  changeLanguageMode,
};

export default authService;
