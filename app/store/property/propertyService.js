import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../constants/axiosConfig";
import axios from "axios";

const createProperty = async (propertyData) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;
  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };

  // Create FormData object
  const formData = new FormData();

  // Append images if they exist
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        type: "image/jpeg",
        name: image.fileName || `image${index}.jpg`,
      });
    });
  }

  // Append other fields
  Object.keys(propertyData).forEach((key) => {
    if (key !== "images") {
      if (key === "typeSpecificFields") {
        formData.append(key, JSON.stringify(propertyData[key]));
      } else {
        formData.append(key, propertyData[key]);
      }
    }
  });

  try {
    const response = await axios.post(
      `${baseUrl}/property/create-property`,
      formData,
      {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllProperties = async ({
  limit,
  minPrice,
  maxPrice,
  location,
  propertyType,
  propertyUse,
  numBed,
}) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };

  let query = `?limit=${5}`;
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
  if (propertyUse) {
    query += `&property_use=${encodeURIComponent(propertyUse)}`;
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

const getPropertiesByUse = async (use) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };

  const response = await axios.get(`${baseUrl}/property/use/${use}`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const getUserProperties = async () => {
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

const buyProperty = async (data) => {
  try {
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
      `${baseUrl}/property/buy-property`,
      {
        propertyId: data.propertyId,
        paymentMethod: data.paymentMethod,
      },
      config
    );

    return response.data;
  } catch (error) {
    // Throw error with proper message
    throw error.response?.data?.message || error.message || "An error occurred";
  }
};

const getUserTransactions = async () => {
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

  const response = await axios.get(
    `${baseUrl}/transaction/user-transactions`,
    config
  );
  return response.data;
};

const propertyService = {
  createProperty,
  getAllProperties,
  getPropertiesByUse,
  getUserProperties,
  buyProperty,
  getUserTransactions,
};

export default propertyService;
