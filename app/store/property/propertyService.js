import { baseUrl } from "../../constants/axiosConfig";
import axios from "axios";

const createProperty = async (data) => {
  const response = await axios.post(
    `${baseUrl}/property/create-property`,
    data
  );
  console.log(response.data);
  return response.data;
};

const getAllProperties = async () => {
  const response = await axios.get(`${baseUrl}/property/all-properties`);
  return response.data;
};

const propertyService = {
  createProperty,
  getAllProperties,
};

export default propertyService;
