import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPropertyTypes } from "../../store/propertyType/propertyTypeSlice";
import CustomButton from "../../components/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";

const Create = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(getAllPropertyTypes());
  }, [dispatch]);

  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedPropertyUse, setSelectedPropertyUse] = useState("");
  const [propertyUseVisible, setPropertyUseVisible] = useState(false);

  const usePropertyData = ["rent", "sell"];
  const { propertyTypes } = useSelector((state) => state.propertyType);

  const animateDropdown = (show) => {
    Animated.spring(dropdownAnimation, {
      toValue: show ? 1 : 0,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  };

  const handlePropertyTypeSelect = (type) => {
    setSelectedPropertyId(type);
    setPropertyTypeVisible(false);
    animateDropdown(false);
  };

  const handlePropertyUseSelect = (use) => {
    setSelectedPropertyUse(use);
    setPropertyUseVisible(false);
    animateDropdown(false);
  };

  const handleNext = () => {
    router.push({
      pathname: "/create_property",
      params: { type: selectedPropertyId, action: selectedPropertyUse },
    });
  };

  const handleOutsidePress = () => {
    if (propertyTypeVisible) {
      setPropertyTypeVisible(false);
      animateDropdown(false);
    }
    if (propertyUseVisible) {
      setPropertyUseVisible(false);
      animateDropdown(false);
    }
  };

  const SelectBox = ({ label, value, onPress, icon, isOpen }) => {
    const getDisplayValue = () => {
      if (label === "Property Type" && value) {
        const selectedType = propertyTypes.find((type) => type._id === value);
        return selectedType ? selectedType.name : "Select option";
      }
      return value || "Select option";
    };

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            onPress();
            animateDropdown(true);
          }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl mb-2 shadow-sm w-full"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-orange-100 dark:bg-orange-700 p-2 rounded-full mr-4">
                <Ionicons name={icon} size={24} color="#F97316" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  {label}
                </Text>
                <Text className="text-gray-800 dark:text-white text-lg font-semibold">
                  {getDisplayValue()}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-down"
              size={24}
              color="#6B7280"
              style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
            />
          </View>
        </TouchableOpacity>

        {isOpen && (
          <Animated.View
            style={{
              transform: [
                {
                  translateY: dropdownAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
              opacity: dropdownAnimation,
            }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4"
          >
            {(label === "Property Type" ? propertyTypes : usePropertyData).map(
              (item) => (
                <TouchableOpacity
                  key={typeof item === "object" ? item._id : item}
                  onPress={() =>
                    label === "Property Type"
                      ? handlePropertyTypeSelect(item._id)
                      : handlePropertyUseSelect(item)
                  }
                  className="p-4 flex-row items-center border-b border-gray-100 dark:border-gray-700"
                >
                  <Ionicons
                    name={
                      label === "Property Type"
                        ? "home"
                        : item === "rent"
                        ? "key-outline"
                        : "cart-outline"
                    }
                    size={20}
                    color="#F97316"
                    className="mr-3"
                  />
                  <Text className="text-gray-700 dark:text-white text-lg capitalize">
                    {typeof item === "object" ? item.name : item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <View
      className="flex-1 bg-gray-100 dark:bg-gray-900"
      onPress={handleOutsidePress}
    >
      <ScrollView className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Create Listing
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Let's get started with your property listing
          </Text>
        </View>

        {/* Selection Area */}
        <View className="space-y-2">
          <SelectBox
            label="Property Type"
            value={selectedPropertyId}
            onPress={() => {
              setPropertyTypeVisible(!propertyTypeVisible);
              setPropertyUseVisible(false);
            }}
            icon="home-outline"
            isOpen={propertyTypeVisible}
          />

          <SelectBox
            label="Property Use"
            value={selectedPropertyUse}
            onPress={() => {
              setPropertyUseVisible(!propertyUseVisible);
              setPropertyTypeVisible(false);
            }}
            icon="business-outline"
            isOpen={propertyUseVisible}
          />
        </View>
      </ScrollView>
      <View className="p-6 bg-gray-100 dark:bg-gray-900">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedPropertyId || !selectedPropertyUse}
          className={`p-4 rounded-2xl ${
            selectedPropertyId && selectedPropertyUse
              ? "bg-[#FF8E01]"
              : "bg-gray-400"
          }`}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Create;
