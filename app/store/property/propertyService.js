import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../constants/axiosConfig";
import axios from "axios";

const createProperty = async (data) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;
  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };
  const response = await axios.post(
    `${baseUrl}/property/create-property`,
    data,
    {
      headers,
      withCredentials: true,
    }
  );
  console.log(response.data);
  return response.data;
};

const getAllProperties = async ({
  limit,
  minPrice,
  maxPrice,
  location,
  propertyType,
  numBed,
}) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };

  let query = `?limit=${limit}`;
  if (minPrice) {
    query += `&price[gte]=${minPrice}`;
  }
  if (maxPrice) {
    query += `&price[lte]=${maxPrice}`;
  }
  if (location) {
    query += `&location=${encodeURIComponent(location)}`;
  }
  if (propertyType) {
    query += `&property_type=${encodeURIComponent(propertyType)}`;
  }
  if (numBed) {
    query += `&num_bed=${numBed}`;
  }

  const response = await axios.get(
    `${baseUrl}/property/all-properties${query}`,
    {
      headers,
      withCredentials: true,
    }
  );

  return response.data;
};

const getAllSellProperties = async () => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.get(`${baseUrl}/property/all-sell-properties`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const getAllRentProperties = async () => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.get(`${baseUrl}/property/all-rent-properties`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const getAllUsersProperties = async () => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  const response = await axios.get(`${baseUrl}/property/users-properties`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const propertyService = {
  createProperty,
  getAllProperties,
  getAllSellProperties,
  getAllRentProperties,
  getAllUsersProperties,
};

export default propertyService;
