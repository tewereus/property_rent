import { baseUrl } from "../../constants/axiosConfig";
import axios from "axios";

const createPropertyType = async (data) => {
  const response = await axios.post(
    `${baseUrl}/property-type/create-type`,
    data
  );
  console.log(response.data);
  return response.data;
};

const getAllPropertyTypes = async () => {
  const response = await axios.get(`${baseUrl}/property-type/all-types`);
  return response.data;
};

const propertyTypeService = {
  createPropertyType,
  getAllPropertyTypes,
};

export default propertyTypeService;
