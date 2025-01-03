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
import { Picker } from "@react-native-picker/picker";

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

    const propertyData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      propertyType: formData.propertyType,
      property_use: formData.property_use,
      region: formData.region,
      subregion: formData.subregion,
      location: formData.location,
      typeSpecificFields: formData.typeSpecificFields,
      images: formData.images,
    };

    if (action === "rent") {
      router.push({
        pathname: "/payment_post",
        params: {
          propertyData: JSON.stringify(propertyData),
          isEdit: "false",
        },
      });
    } else {
      // For sale properties, create directly
      dispatch(createProperty(data));
    }
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

          {/* Region Picker */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Region *
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <Picker
                selectedValue={formData.region}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, region: value }))
                }
                style={{ height: 50, width: "100%" }}
              >
                <Picker.Item label="Select Region" value="" />
                {regions.map((region) => (
                  <Picker.Item
                    key={region._id}
                    label={region.region_name}
                    value={region._id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Sub Region Picker */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sub Region *
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <Picker
                selectedValue={formData.subregion}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subregion: value }))
                }
                style={{ height: 50, width: "100%" }}
                enabled={!!formData.region}
              >
                <Picker.Item label="Select Sub Region" value="" />
                {filteredSubRegions.map((subRegion) => (
                  <Picker.Item
                    key={subRegion._id}
                    label={subRegion.subregion_name}
                    value={subRegion._id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Location Picker */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location *
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <Picker
                selectedValue={formData.location}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, location: value }))
                }
                style={{ height: 50, width: "100%" }}
                enabled={!!formData.subregion}
              >
                <Picker.Item label="Select Location" value="" />
                {filteredLocations.map((location) => (
                  <Picker.Item
                    key={location._id}
                    label={location.location}
                    value={location._id}
                  />
                ))}
              </Picker>
            </View>
          </View>

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
