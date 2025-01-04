import axios from "axios";
import { baseUrl } from "../../constants/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initializePayment = async (data) => {
  try {
    console.log(data);
    const userData = await AsyncStorage.getItem("user");
    const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;
    const config = {
      headers: {
        Authorization: `Bearer ${
          getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
        }`,
      },
      withCredentials: true,
    };

    const response = await axios.post(
      `${baseUrl}/payment/initialize`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Payment initialization failed";
    throw new Error(errorMessage);
  }
};

const verifyPayment = async (reference) => {
  try {
    const userData = await AsyncStorage.getItem("user");
    const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

    const response = await axios.get(`${baseUrl}/payment/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage?.token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Payment verification failed";
    throw new Error(errorMessage);
  }
};

const paymentService = {
  initializePayment,
  verifyPayment,
};

export default paymentService;
