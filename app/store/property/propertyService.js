import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../constants/axiosConfig";
import axios from "axios";

const getAuthToken = () => {
  const userData = AsyncStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  return user?.token || "";
};

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
  console.log(propertyData);
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
  region,
  subregion,
}) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };

  // Build query parameters
  const params = new URLSearchParams();

  if (limit) params.append("limit", limit);
  if (minPrice) params.append("price[gte]", minPrice);
  if (maxPrice) params.append("price[lte]", maxPrice);
  if (region) params.append("address.region", region);
  if (subregion) params.append("address.subregion", subregion);
  if (location) params.append("address.location", location);
  if (propertyType) params.append("propertyType", propertyType);
  if (propertyUse) params.append("property_use", propertyUse);

  const response = await axios.get(
    `${baseUrl}/property/all-properties?${params.toString()}`,
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

const updateProperty = async (propertyData) => {
  const userData = await AsyncStorage.getItem("user");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  // console.log("Sending property data:", propertyData);

  const formData = new FormData();

  // Handle address object
  if (propertyData.region || propertyData.subregion || propertyData.location) {
    const address = {
      region: propertyData.region,
      subregion: propertyData.subregion,
      location: propertyData.location,
    };
    formData.append("address", JSON.stringify(address));
  }

  // Handle images
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach((image, index) => {
      if (image.uri) {
        // New image
        formData.append("images", {
          uri: image.uri,
          type: "image/jpeg",
          name: image.fileName || `image${index}.jpg`,
        });
      } else {
        // Existing image URL
        formData.append("existingImages", image);
      }
    });
  }

  // Append other fields
  const fieldsToAppend = {
    title: propertyData.title,
    description: propertyData.description,
    price: propertyData.price,
    propertyType: propertyData.propertyType,
    property_use: propertyData.property_use,
    typeSpecificFields: JSON.stringify(propertyData.typeSpecificFields),
  };

  Object.entries(fieldsToAppend).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  console.log(formData);

  const response = await axios.put(
    `${baseUrl}/property/update/${propertyData._id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage?.token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

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

const changeView = async (data) => {
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
    `${baseUrl}/property/change-view`,
    data,
    config
  );
  return response.data;
};

const getAllViews = async () => {
  const response = await axios.get(`${baseUrl}/property/all-views`);
  return response.data;
};

const changeFeatured = async (prodId) => {
  console.log(prodId);
  const response = await axios.put(
    `${baseUrl}/property/change-featured/${prodId}`
  );
  return response.data;
};

const getRejectionMessages = async () => {
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
    `${baseUrl}/property/rejected-message`,
    config
  );
  return response.data;
};

const getAllFeatured = async () => {
  const response = await axios.get(`${baseUrl}/property/featured`);
  return response.data;
};

const propertyService = {
  createProperty,
  getAllProperties,
  getPropertiesByUse,
  getUserProperties,
  updateProperty,
  buyProperty,
  getUserTransactions,
  changeView,
  getAllViews,
  changeFeatured,
  getRejectionMessages,
  getAllFeatured,
};

export default propertyService;
