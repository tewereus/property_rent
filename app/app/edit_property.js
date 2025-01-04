import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { updateProperty } from "../store/property/propertySlice";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyForm from "../components/PropertyForm";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAllPropertyTypes } from "../store/propertyType/propertyTypeSlice";
import {
  getAllRegions,
  getAllSubRegions,
  getAllLocations,
} from "../store/address/addressSlice";
import { Picker } from "@react-native-picker/picker";

const EditProperty = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const property = JSON.parse(params.property);

  const [formData, setFormData] = useState({
    _id: property._id,
    title: property.title || "",
    description: property.description || "",
    price: property.price?.toString() || "0",
    propertyType: property.propertyType?._id || "",
    property_use: property.property_use || "",
    region: property.address?.region?._id || property.address?.region || "",
    subregion:
      property.address?.subregion?._id || property.address?.subregion || "",
    location:
      property.address?.location?._id || property.address?.location || "",
    images: property.images || [],
    typeSpecificFields: property.typeSpecificFields || {},
  });

  const { propertyTypes } = useSelector((state) => state.propertyType);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const { regions, subregions, locations } = useSelector(
    (state) => state.address
  );
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    dispatch(getAllPropertyTypes());
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
  }, []);

  useEffect(() => {
    if (formData.region) {
      const filtered = subregions?.filter(
        (subregion) => subregion?.region_id?._id === formData.region
      );
      setFilteredSubRegions(filtered);
    }
  }, [formData.region, subregions]);

  useEffect(() => {
    if (formData.subregion) {
      const filtered = locations?.filter(
        (location) => location?.subregion_id?._id === formData.subregion
      );
      setFilteredLocations(filtered);
    }
  }, [formData.subregion, locations]);

  const handleSubmit = useCallback(() => {
    // Validation
    if (
      !formData.title ||
      !formData.location ||
      !formData.price ||
      !formData.description ||
      !formData.region ||
      !formData.subregion ||
      !formData.location ||
      !formData.propertyType ||
      !formData.property_use
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const propertyData = {
      _id: property._id,
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

    // Check if changing to rent
    if (property.property_use !== "rent" && formData.property_use === "rent") {
      router.push({
        pathname: "/payment_post",
        params: {
          propertyData: JSON.stringify(propertyData),
          isEdit: true,
          isSale: property?.property_use,
        },
      });
    } else {
      dispatch(updateProperty(propertyData))
        .unwrap()
        .then(() => {
          Alert.alert("Success", "Property updated successfully", [
            { text: "OK", onPress: () => router.back() },
          ]);
        })
        .catch((error) => {
          Alert.alert("Error", error.message || "Failed to update property");
        });
    }
  }, [formData, property]);

  const PropertyTypeSelector = () => (
    <View className="mb-6">
      <Text className="text-gray-600 dark:text-gray-300 mb-2 text-base font-medium">
        Property Type
      </Text>
      <TouchableOpacity
        onPress={() => setShowTypeModal(true)}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex-row justify-between items-center"
      >
        <Text className="text-gray-700 dark:text-gray-300">
          {propertyTypes?.find((type) => type._id === formData.propertyType)
            ?.name || "Select Type"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  const PropertyUseSelector = () => (
    <View className="mb-6">
      <Text className="text-gray-600 dark:text-gray-300 mb-2 text-base font-medium">
        Property Use
      </Text>
      <View className="flex-row space-x-4">
        {["rent", "sell"]?.map((use) => (
          <TouchableOpacity
            key={use}
            onPress={() =>
              setFormData((prev) => ({ ...prev, property_use: use }))
            }
            className={`flex-1 p-4 rounded-xl border ${
              formData.property_use === use
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <Text
              className={`text-center capitalize ${
                formData.property_use === use
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              For {use}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const TypeSelectionModal = () => (
    <Modal
      visible={showTypeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTypeModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-gray-800 rounded-t-3xl">
          <View className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              Select Property Type
            </Text>
          </View>
          <ScrollView className="max-h-[70%] p-6">
            {propertyTypes?.map((type) => (
              <TouchableOpacity
                key={type._id}
                onPress={() => {
                  setFormData((prev) => ({ ...prev, propertyType: type._id }));
                  setShowTypeModal(false);
                }}
                className="p-4 border-b border-gray-100 dark:border-gray-700"
              >
                <Text className="text-gray-700 dark:text-gray-300 text-lg">
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="p-6">
            <TouchableOpacity
              onPress={() => setShowTypeModal(false)}
              className="bg-gray-200 dark:bg-gray-700 p-4 rounded-xl"
            >
              <Text className="text-center text-gray-700 dark:text-gray-300">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const DynamicFields = () => {
    const selectedType = propertyTypes?.find(
      (type) => type._id === formData.propertyType
    );
    if (!selectedType?.fields) return null;

    const renderField = (field) => {
      const value = formData.typeSpecificFields[field.name]?.toString() || "";

      switch (field.type) {
        case "Boolean":
          return (
            <View className="flex-row space-x-4">
              {["true", "false"]?.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      typeSpecificFields: {
                        ...prev.typeSpecificFields,
                        [field.name]: option === "true",
                      },
                    }))
                  }
                  className={`flex-1 p-4 rounded-xl border ${
                    value === option
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Text
                    className={`text-center capitalize ${
                      value === option
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );

        case "Number":
          return (
            <TextInput
              value={value}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  typeSpecificFields: {
                    ...prev.typeSpecificFields,
                    [field.name]: text ? parseFloat(text) : "",
                  },
                }))
              }
              placeholder={`Enter ${field.name}`}
              keyboardType="numeric"
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          );

        default:
          return (
            <TextInput
              value={value}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  typeSpecificFields: {
                    ...prev.typeSpecificFields,
                    [field.name]: text,
                  },
                }))
              }
              placeholder={`Enter ${field.name}`}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          );
      }
    };

    return (
      <View className="space-y-4">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Property Details
        </Text>
        {selectedType?.fields?.map((field) => (
          <View key={field.name} className="mb-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-600 dark:text-gray-300 text-base">
                {field.name.replace(/([A-Z])/g, " $1").trim()}
              </Text>
              {field.required && <Text className="text-red-500 ml-1">*</Text>}
            </View>
            {renderField(field)}
          </View>
        ))}
      </View>
    );
  };

  const AddressSelector = () => (
    <View className="space-y-4 mb-6">
      <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Location Details
      </Text>

      {/* Region Picker */}
      <View>
        <Text className="text-gray-600 dark:text-gray-300 mb-2">Region</Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <Picker
            selectedValue={formData.region}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                region: value,
                subregion: "",
                location: "",
              }))
            }
          >
            <Picker.Item label="Select Region" value="" />
            {regions?.map((region) => (
              <Picker.Item
                key={region._id}
                label={region.region_name}
                value={region._id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* SubRegion Picker */}
      <View>
        <Text className="text-gray-600 dark:text-gray-300 mb-2">
          Sub Region
        </Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <Picker
            selectedValue={formData.subregion}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                subregion: value,
                location: "",
              }))
            }
            enabled={!!formData.region}
          >
            <Picker.Item label="Select Sub Region" value="" />
            {filteredSubRegions?.map((subregion) => (
              <Picker.Item
                key={subregion._id}
                label={subregion.subregion_name}
                value={subregion._id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Location Picker */}
      <View>
        <Text className="text-gray-600 dark:text-gray-300 mb-2">Location</Text>
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <Picker
            selectedValue={formData.location}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, location: value }))
            }
            enabled={!!formData.subregion}
          >
            <Picker.Item label="Select Location" value="" />
            {filteredLocations?.map((location) => (
              <Picker.Item
                key={location._id}
                label={location.location}
                value={location._id}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="bg-white dark:bg-gray-800 p-6 rounded-b-3xl shadow-sm">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text
              className="text-2xl font-bold text-gray-800 dark:text-white"
              onPress={() => console.log(property)}
            >
              Edit Property
            </Text>
          </View>
          <Text className="text-gray-500 dark:text-gray-400">
            Update your property details
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 pt-6"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6">
            <PropertyTypeSelector />
            <PropertyUseSelector />
            <AddressSelector />
            <PropertyForm
              formData={formData}
              setFormData={setFormData}
              propertyType={formData.propertyType}
              isEdit={true}
            />
            <DynamicFields />
          </View>
        </ScrollView>

        <View className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#FF8E01] p-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Update Property
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TypeSelectionModal />
    </SafeAreaView>
  );
};

export default EditProperty;
