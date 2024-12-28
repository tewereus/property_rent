// app/app/create_property.js
import { View, Text, ScrollView, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createProperty,
  resetAuthState,
} from "../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import PropertyForm from "../components/PropertyForm";
// import MapComponent from "../components/MapComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getAllRegions,
  getAllSubRegions,
  getAllLocations,
} from "../store/address/addressSlice";

const CreateProperty = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type, action } = useLocalSearchParams();
  const { propertyTypes } = useSelector((state) => state.propertyType);
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
  }, []);

  const { regions, subregions, locations } = useSelector(
    (state) => state.address
  );

  const selectedPropertyType = propertyTypes?.find((pt) => pt._id === type);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: 0,
    description: "",
    region: "",
    subregion: "",
    location: "",
    propertyType: type,
    property_use: action,
    typeSpecificFields: {},
    images: [],
  });

  useEffect(() => {
    if (formData.region) {
      const regionSubRegions = subregions.filter(
        (subRegion) => subRegion.region_id?._id === formData.region
      );
      setFilteredSubRegions(regionSubRegions);
      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        subregion: "",
        location: "",
      }));
      setFilteredLocations([]);
    }
  }, [formData.region, subregions]);

  // Handle subregion selection
  useEffect(() => {
    if (formData.subregion) {
      // console.log("subRegionLocations");
      const subRegionLocations = locations.filter(
        (location) => location?.subregion_id?._id === formData.subregion
      );
      // console.log(subRegionLocations);
      setFilteredLocations(subRegionLocations);
      setFormData((prev) => ({
        ...prev,
        location: "",
      }));
    }
  }, [formData.subregion, formData.region, locations]);

  const [showMapModal, setShowMapModal] = useState(false);

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.property
  );

  // useEffect(() => {
  //   if (isSuccess) {
  //     alert("Property created successfully!");
  //     router.back();
  //     dispatch(resetAuthState());
  //   }
  //   if (isError) {
  //     alert(message);
  //     dispatch(resetAuthState());
  //   }
  // }, [isSuccess, isError]);

  const handleLocationSelect = (coords) => {
    const locationString = `${coords.latitude}, ${coords.longitude}`;
    setFormData({ ...formData, location: locationString });
    setShowMapModal(false);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (
      !formData.title ||
      !formData.location ||
      !formData.price ||
      !formData.description ||
      !formData.region ||
      !formData.subregion ||
      !formData.location
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    const data = {
      ...formData,
      propertyType: type,
      property_use: action,
    };

    console.log(data);

    dispatch(createProperty(data));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="bg-white dark:bg-gray-800 p-6 rounded-b-3xl shadow-sm">
          <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Create Property
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Fill in the details for your {type} listing
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6">
            <PropertyForm
              formData={formData}
              setFormData={setFormData}
              propertyType={selectedPropertyType}
            />
          </View>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              onClick={() => console.log(formData.region)}
            >
              Region *
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              required
              // disabled={!form.country}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.region_name}
                </option>
              ))}
            </select>
            {/* {errors.region && (
              <p className="mt-1 text-sm text-red-500">{errors.region}</p>
            )} */}
          </div>

          {/* Sub Region */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              onClick={() => console.log(formData.subregion)}
            >
              Sub Region *
            </label>
            <select
              name="subregion"
              value={formData.subregion}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              required
              disabled={!formData.region}
            >
              <option value="">Select Sub Region</option>
              {filteredSubRegions.map((subRegion) => (
                <option key={subRegion._id} value={subRegion._id}>
                  {subRegion.subregion_name}
                </option>
              ))}
            </select>
            {/* {errors.subregion && (
              <p className="mt-1 text-sm text-red-500">{errors.subRegion}</p>
            )} */}
          </div>

          {/* Location */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              onClick={() => console.log(formData.location)}
            >
              Location *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              required
              disabled={!formData.subregion}
            >
              <option value="">Select Location</option>
              {filteredLocations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.location}
                </option>
              ))}
            </select>
            {/* {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )} */}
          </div>

          <TouchableOpacity
            onPress={() => setShowMapModal(true)}
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl mb-6 flex-row items-center"
          >
            <View className="bg-blue-100 dark:bg-blue-800 p-2 rounded-xl mr-4">
              <Ionicons name="location-outline" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                Select Location
              </Text>
              <Text className="text-blue-500 dark:text-blue-300 opacity-60">
                {formData.location || "Choose on map"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`bg-[#FF8E01] p-4 rounded-2xl mb-6 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? "Creating Property..." : "Add Property"}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={showMapModal}
          animationType="slide"
          onRequestClose={() => setShowMapModal(false)}
        >
          <View className="flex-1">
            {/* <MapComponent onLocationSelect={handleLocationSelect} /> */}
            <View className="p-6">
              <TouchableOpacity
                onPress={() => setShowMapModal(false)}
                className="bg-gray-200 dark:bg-gray-800 p-4 rounded-2xl"
              >
                <Text className="text-gray-800 dark:text-white text-center text-lg font-semibold">
                  Close Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default CreateProperty;
