import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRentProperties,
  getAllSellProperties,
  getPropertiesByUse,
  buyProperty,
} from "../../store/property/propertySlice";
import {
  addToWishlist,
  changeLanguage,
  changeLanguageMode,
} from "../../store/auth/authSlice";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

// Memoize the PropertyItem component to prevent unnecessary re-renders
const PropertyItem = memo(({ item, onPress, onFavorite }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    className="bg-white rounded-2xl shadow-lg m-2 overflow-hidden"
    style={{
      width: 280,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }}
  >
    <View className="relative">
      <Image
        source={{ uri: item.image }}
        className="w-full h-48"
        resizeMode="cover"
      />

      {/* Price Tag */}
      <View className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
        <Text className="text-blue-600 font-bold">{item.price}</Text>
      </View>

      {/* Favorite Button */}
      <TouchableOpacity
        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full"
        onPress={() => onFavorite(item)}
      >
        <Ionicons
          name={item.isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={item.isFavorite ? "#EF4444" : "#6B7280"}
        />
      </TouchableOpacity>
    </View>

    {/* Content Container */}
    <View className="pl-4 pr-4 pb-4">
      {/* Property Name */}
      <Text className="text-lg font-bold text-gray-800 mb-1">{item.name}</Text>

      {/* Location */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={16} color="#6B7280" />
        <Text className="text-gray-500 text-sm ml-1">
          {item.location || "Location not specified"}
        </Text>
      </View>

      {/* Property Details */}
      <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
        {/* Bedrooms */}
        <View className="flex-row items-center">
          <Ionicons name="bed-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-sm ml-1">
            {item.bedrooms || "3"} beds
          </Text>
        </View>

        {/* Bathrooms */}
        <View className="flex-row items-center">
          <Ionicons name="water-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-sm ml-1">
            {item.bathrooms || "2"} baths
          </Text>
        </View>

        {/* Area */}
        <View className="flex-row items-center">
          <Ionicons name="square-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-sm ml-1">
            {item.area || "1,200"} sqft
          </Text>
        </View>
      </View>

      {/* Date and Status */}
      <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
        <Text className="text-gray-500 text-xs">
          Listed {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View className="bg-green-100 px-2 py-1 rounded-full">
          <Text className="text-green-600 text-xs font-medium">
            {item.status || "Available"}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

// Create a separate memoized modal component
const PropertyModal = memo(
  ({
    visible,
    onClose,
    property,
    favouriteOn,
    onFavourite,
    onBuy,
    onScheduleVisit,
    isPurchasing,
    isSchedulingVisit,
    showPaymentOptions,
    setShowPaymentOptions,
    paymentMethod,
    setPaymentMethod,
  }) => {
    if (!visible || !property) return null;

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          <View className="relative bg-white dark:bg-gray-900 pt-12 pb-4 px-5">
            <TouchableOpacity
              onPress={onClose}
              className="absolute left-5 top-12 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-center text-xl font-bold text-gray-800 dark:text-white">
              Property Details
            </Text>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
          >
            <View className="relative">
              <Image
                source={{ uri: property.image }}
                className="w-screen h-72"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={onFavourite}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full z-10"
              >
                <Ionicons
                  name={favouriteOn ? "heart" : "heart-outline"}
                  size={24}
                  color={favouriteOn ? "#EF4444" : "#6B7280"}
                />
              </TouchableOpacity>
            </View>

            {/* Rest of the modal content */}
            {/* ... */}
          </ScrollView>

          {/* Bottom Action Button */}
          <View className="p-5 border-t border-gray-200 dark:border-gray-800">
            {showPaymentOptions ? (
              <View>
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
                <TouchableOpacity
                  onPress={onBuy}
                  disabled={isPurchasing}
                  className={`${
                    isPurchasing ? "bg-gray-400" : "bg-blue-600"
                  } rounded-xl py-4 px-6`}
                >
                  {isPurchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-base">
                      Confirm{" "}
                      {property?.property_use === "rent"
                        ? "Rental"
                        : "Purchase"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowPaymentOptions(true)}
                className="bg-blue-600 rounded-xl py-4 px-6"
              >
                <Text className="text-white text-center font-semibold text-base">
                  {property?.property_use === "rent"
                    ? "Rent Property"
                    : "Buy Property"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  }
);

// Memoize PaymentMethodSelector
const PaymentMethodSelector = memo(({ paymentMethod, setPaymentMethod }) => (
  <View className="mb-4">
    <Text className="text-gray-800 dark:text-white font-semibold mb-2">
      Select Payment Method
    </Text>
    {["cash", "bank_transfer", "mortgage"].map((method) => (
      <TouchableOpacity
        key={method}
        onPress={() => setPaymentMethod(method)}
        className={`flex-row items-center p-4 rounded-xl mb-2 ${
          paymentMethod === method
            ? "bg-blue-100 dark:bg-blue-900"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <Ionicons
          name={
            method === "cash"
              ? "cash-outline"
              : method === "bank_transfer"
              ? "card-outline"
              : "business-outline"
          }
          size={24}
          color={paymentMethod === method ? "#3B82F6" : "#6B7280"}
        />
        <Text
          className={`ml-3 capitalize ${
            paymentMethod === method
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {method.replace("_", " ")}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
));

// Add this new component for section headers
const SectionHeader = memo(({ title, onSeeAll }) => (
  <View className="flex-row justify-between items-center mb-3 px-5">
    <Text className="text-lg font-bold dark:text-white">{title}</Text>
    <TouchableOpacity onPress={onSeeAll}>
      <Text className="text-blue-600 dark:text-blue-400">See All</Text>
    </TouchableOpacity>
  </View>
));

// Update the property item render function
const renderPropertyItem = ({ item }) => (
  <TouchableOpacity
    onPress={() => handlePress(item)}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md mx-2 w-56 overflow-hidden"
  >
    <Image
      source={{ uri: item.image }}
      className="w-full h-32"
      resizeMode="cover"
    />
    <View className="p-3">
      <Text className="text-blue-600 dark:text-blue-400 font-bold text-base mb-1">
        ${item.price}
      </Text>
      <Text
        className="text-gray-800 dark:text-white font-semibold mb-1"
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={14} color="#6B7280" />
        <Text
          className="text-gray-500 dark:text-gray-400 text-sm ml-1"
          numberOfLines={1}
        >
          {item.location}
        </Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-500 dark:text-gray-400 text-xs">
          {item.bedrooms} Beds • {item.bathrooms} Baths
        </Text>
        <TouchableOpacity onPress={() => handleFavourite(item)}>
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={item.isFavorite ? "#EF4444" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const Home = () => {
  const dispatch = useDispatch();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favouriteOn, setFavouriteOn] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const loadColorScheme = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      if (userData && userData.preference) {
        const storedMode = userData.preference.mode;
        setColorScheme(storedMode);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useEffect(() => {
    loadColorScheme();
    dispatch(getPropertiesByUse("sell"));
    dispatch(getPropertiesByUse("rent"));
  }, []);

  const { propertiesByUse, isSuccess } = useSelector((state) => state.property);

  const { t, i18n } = useTranslation();

  // Memoize callback functions
  const handlePress = useCallback((prop) => {
    setSelectedProperty(prop);
    setFavouriteOn(prop.isFavorite);
    setModalVisible(true);
  }, []);

  const handleFavourite = useCallback(() => {
    const data = {
      prodId: selectedProperty?._id,
    };
    dispatch(addToWishlist(data));
    setFavouriteOn(!favouriteOn);
  }, [selectedProperty, favouriteOn]);

  // Optimize FlatList rendering
  const renderPropertyItem = useCallback(
    ({ item }) => (
      <PropertyItem
        item={item}
        onPress={handlePress}
        onFavorite={handleFavourite}
      />
    ),
    [handlePress, handleFavourite]
  );

  const keyExtractor = useCallback((item) => item._id, []);
  const ItemSeparator = useCallback(() => <View style={{ width: 15 }} />, []);

  const handleLanguageChange = (lng) => {
    const data = {
      preference: {
        language: lng,
      },
    };
    i18n.changeLanguage(lng);
    dispatch(changeLanguageMode(data));
  };

  const handleBuyProperty = async () => {
    if (!selectedProperty?._id) return;

    setIsPurchasing(true);
    try {
      const result = await dispatch(
        buyProperty({
          propertyId: selectedProperty._id,
          paymentMethod: paymentMethod,
        })
      ).unwrap();

      Alert.alert(
        "Success",
        "Property purchase initiated successfully! Check your transactions for details.",
        [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              setShowPaymentOptions(false);
              setPaymentMethod("cash");
              // Refresh properties list
              dispatch(getPropertiesByUse(selectedProperty.property_use));
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error || "Failed to initiate property purchase. Please try again later."
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleScheduleVisit = () => {
    setIsSchedulingVisit(true);
    Alert.alert(
      "Schedule Visit",
      "Our agent will contact you shortly to arrange a visit.",
      [
        {
          text: "OK",
          onPress: () => setIsSchedulingVisit(false),
        },
      ]
    );
  };

  const categories = [
    { icon: "home", label: "Apartment", type: "Apartment" },
    { icon: "car", label: "Cars", type: "Vehicle" },
    { icon: "map", label: "Land", type: "Land" },
    { icon: "business", label: "Villas", type: "Villa" },
    { icon: "storefront", label: "Commercial", type: "Commercial" },
    { icon: "grid", label: "Office", type: "Office" },
    { icon: "home-outline", label: "Houses", type: "House" },
  ];

  const handleCategoryPress = (category) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: { filterType: category.type },
    });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      className="items-center mx-4"
      onPress={() => handleCategoryPress(item)}
    >
      <View className="bg-white dark:bg-gray-800 p-3 rounded-full mb-1">
        <Ionicons name={item.icon} size={24} color="#6B7280" />
      </View>
      <Text className="text-xs text-gray-600 dark:text-gray-300">
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderFeaturedListing = ({ item }) => (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mx-2 w-72">
      <View className="bg-gray-200 dark:bg-gray-700 h-40 rounded-xl mb-4 justify-center items-center">
        <Text className="text-gray-500 dark:text-gray-400">Property Image</Text>
      </View>
      <Text className="text-lg font-bold text-gray-800 dark:text-white">
        Modern Apartment
      </Text>
      <Text className="text-gray-500 dark:text-gray-400">New York, USA</Text>
      <Text className="text-blue-600 dark:text-blue-400">$2,500/month</Text>
    </View>
  );

  const handleSeeAll = (propertyUse) => {
    console.log(propertyUse);
    router.push({
      pathname: "/(tabs)/explore",
      params: { propertyUse },
    });
  };

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] flex-1">
      <View className="px-5 pt-5">
        {/* Header with Language Selection and Notification */}
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold dark:text-slate-300">
            Prime Property
          </Text>
          <View className="flex-row items-center">
            <View className="flex-row bg-white/90 dark:bg-gray-800/90 rounded-full mr-3 overflow-hidden">
              <TouchableOpacity
                onPress={() => handleLanguageChange("Eng")}
                className="px-3 py-1"
                style={{
                  backgroundColor:
                    i18n.language === "Eng" ? "#FF8E01" : "transparent",
                }}
              >
                <Text
                  className={`${
                    i18n.language === "Eng"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLanguageChange("Amh")}
                className="px-3 py-1"
                style={{
                  backgroundColor:
                    i18n.language === "Amh" ? "#FF8E01" : "transparent",
                }}
              >
                <Text
                  className={`${
                    i18n.language === "Amh"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  አማ
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
              onPress={() => {
                /* Handle notification press */
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6B7280"
              />
              {/* Notification badge - if needed */}
              <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-white text-xs">2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Categories */}
        <View className="mb-6">
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.label}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>

        {/* Featured Listings */}
        <View className="mb-6">
          <SectionHeader title="Featured Listings" />
          <FlatList
            data={[1, 2, 3]}
            renderItem={renderFeaturedListing}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>

        {/* Sell Properties Section */}
        <View className="mb-6">
          <SectionHeader
            title="Available for Sale"
            onSeeAll={() => handleSeeAll("sell")}
          />
          <FlatList
            data={propertiesByUse.sell}
            keyExtractor={(item) => item._id}
            renderItem={renderPropertyItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={3}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={240}
          />
        </View>

        {/* Rent Properties Section */}
        <View className="mb-6">
          <SectionHeader
            title="Available for Rent"
            onSeeAll={() => handleSeeAll("rent")}
          />
          <FlatList
            data={propertiesByUse.rent}
            keyExtractor={(item) => item._id}
            renderItem={renderPropertyItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={3}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={240}
          />
        </View>
      </ScrollView>

      {/* Property Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          {/* Modal Header */}
          <View className="relative bg-white dark:bg-gray-900 pt-12 pb-4 px-5">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute left-5 top-12 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-center text-xl font-bold text-gray-800 dark:text-white">
              Property Details
            </Text>
          </View>

          {selectedProperty && (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Property Image */}
              <View className="relative">
                <Image
                  source={{ uri: selectedProperty.image }}
                  className="w-screen h-72"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={handleFavourite}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full z-10"
                >
                  <Ionicons
                    name={favouriteOn ? "heart" : "heart-outline"}
                    size={24}
                    color={favouriteOn ? "#EF4444" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View className="p-5">
                {/* Price and Schedule Visit */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${selectedProperty.price}
                  </Text>
                  <TouchableOpacity
                    onPress={handleScheduleVisit}
                    disabled={isSchedulingVisit}
                    className="flex-row items-center bg-green-500 px-4 py-2 rounded-full"
                  >
                    {isSchedulingVisit ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="white"
                        />
                        <Text className="text-white font-semibold ml-2">
                          Schedule Visit
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Property Name */}
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {selectedProperty.name}
                </Text>

                {/* Location */}
                <View className="flex-row items-center mb-4">
                  <Ionicons name="location" size={20} color="#6B7280" />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2 text-base">
                    {selectedProperty.location}
                  </Text>
                </View>

                {/* Property Features */}
                <View className="flex-row justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                  <View className="items-center">
                    <Ionicons name="bed-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.bedrooms || "3"} Beds
                    </Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="water-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.bathrooms || "2"} Baths
                    </Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="square-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.area || "1,200"} sqft
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Description
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedProperty.description || "No description available"}
                </Text>
              </View>
            </ScrollView>
          )}

          {/* Bottom Action Button */}
          <View className="p-5 border-t border-gray-200 dark:border-gray-800">
            {showPaymentOptions ? (
              <View>
                <PaymentMethodSelector />
                <TouchableOpacity
                  onPress={handleBuyProperty}
                  disabled={isPurchasing}
                  className={`${
                    isPurchasing ? "bg-gray-400" : "bg-[#FF8E01]"
                  } rounded-xl py-4 px-6`}
                >
                  {isPurchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-base">
                      Confirm{" "}
                      {selectedProperty?.property_use === "rent"
                        ? "Rental"
                        : "Purchase"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowPaymentOptions(true)}
                className="bg-[#FF8E01] rounded-xl py-4 px-6"
              >
                <Text className="text-white text-center font-semibold text-base">
                  {selectedProperty?.property_use === "rent"
                    ? "Rent Property"
                    : "Buy Property"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(Home);
