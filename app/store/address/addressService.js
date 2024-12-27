import { base_url } from "../../constants/axiosConfig";
import axios from "axios";

const getAllRegions = async () => {
  const response = await axios.get(`${base_url}/region/all-regions`);
  return response.data;
};

const getAllSubRegions = async () => {
  const response = await axios.get(`${base_url}/subregion/all-subregions`);
  return response.data;
};

const getAllLocations = async () => {
  const response = await axios.get(`${base_url}/location/all-locations`);
  return response.data;
};

const addressService = {
  getAllLocations,
  getAllRegions,
  getAllSubRegions,
};

export default addressService;
