import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPropertyTypes } from "../../store/propertyType/propertyTypeSlice";
import CustomButton from "../../components/CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_PIXEL_8_WIDTH = 393; // Base width of Pixel 8
const SCALE_FACTOR = SCREEN_WIDTH / BASE_PIXEL_8_WIDTH;

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

  const animateDropdown = useCallback(
    (show) => {
      Animated.spring(dropdownAnimation, {
        toValue: show ? 1 : 0,
        useNativeDriver: true,
        tension: 20,
        friction: 7,
      }).start();
    },
    [dropdownAnimation]
  );

  const handlePropertyTypeSelect = useCallback(
    (type) => {
      setSelectedPropertyId(type);
      setPropertyTypeVisible(false);
      animateDropdown(false);
    },
    [animateDropdown]
  );

  const handlePropertyUseSelect = useCallback(
    (use) => {
      setSelectedPropertyUse(use);
      setPropertyUseVisible(false);
      animateDropdown(false);
    },
    [animateDropdown]
  );

  const handleNext = useCallback(() => {
    router.push({
      pathname: "/create_property",
      params: { type: selectedPropertyId, action: selectedPropertyUse },
    });
  }, [router, selectedPropertyId, selectedPropertyUse]);

  const handleOutsidePress = useCallback(() => {
    if (propertyTypeVisible) {
      setPropertyTypeVisible(false);
      animateDropdown(false);
    }
    if (propertyUseVisible) {
      setPropertyUseVisible(false);
      animateDropdown(false);
    }
  }, [propertyTypeVisible, propertyUseVisible, animateDropdown]);

  const SelectBox = memo(({ label, value, onPress, icon, isOpen }) => {
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
          className="bg-white dark:bg-gray-800 rounded-2xl mb-2 shadow-sm w-full"
          style={{ padding: 24 * SCALE_FACTOR }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="bg-orange-100 dark:bg-orange-700 rounded-full mr-4"
                style={{ padding: 8 * SCALE_FACTOR }}
              >
                <Ionicons
                  name={icon}
                  size={24 * SCALE_FACTOR}
                  color="#F97316"
                />
              </View>
              <View>
                <Text
                  className="text-gray-500 dark:text-gray-400 mb-1"
                  style={{ fontSize: 14 * SCALE_FACTOR }}
                >
                  {label}
                </Text>
                <Text
                  className="text-gray-800 dark:text-white font-semibold"
                  style={{ fontSize: 18 * SCALE_FACTOR }}
                >
                  {getDisplayValue()}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-down"
              size={24 * SCALE_FACTOR}
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
                  className="flex-row items-center border-b border-gray-100 dark:border-gray-700"
                  style={{ padding: 16 * SCALE_FACTOR }}
                >
                  <Ionicons
                    name={
                      label === "Property Type"
                        ? "home"
                        : item === "rent"
                        ? "key-outline"
                        : "cart-outline"
                    }
                    size={20 * SCALE_FACTOR}
                    color="#F97316"
                    style={{ marginRight: 12 * SCALE_FACTOR }}
                  />
                  <Text
                    className="text-gray-700 dark:text-white capitalize"
                    style={{ fontSize: 18 * SCALE_FACTOR }}
                  >
                    {typeof item === "object" ? item.name : item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </Animated.View>
        )}
      </View>
    );
  });

  return (
    <View
      className="flex-1 bg-gray-100 dark:bg-gray-900"
      onPress={handleOutsidePress}
    >
      <ScrollView style={{ padding: 24 * SCALE_FACTOR }}>
        {/* Header */}
        <View style={{ marginBottom: 32 * SCALE_FACTOR }}>
          <Text
            className="font-bold text-gray-800 dark:text-white mb-2"
            style={{ fontSize: 32 * SCALE_FACTOR }}
          >
            Create Listing
          </Text>
          <Text
            className="text-gray-500 dark:text-gray-400"
            style={{ fontSize: 16 * SCALE_FACTOR }}
          >
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
      <View
        className="bg-gray-100 dark:bg-gray-900"
        style={{ padding: 24 * SCALE_FACTOR }}
      >
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedPropertyId || !selectedPropertyUse}
          className={`rounded-2xl ${
            selectedPropertyId && selectedPropertyUse
              ? "bg-[#FF8E01]"
              : "bg-gray-400"
          }`}
          style={{ padding: 16 * SCALE_FACTOR }}
        >
          <Text
            className="text-white text-center font-semibold"
            style={{ fontSize: 18 * SCALE_FACTOR }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(Create);
