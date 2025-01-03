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
  Dimensions,
  Linking,
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
  getAllViews,
  changeView,
} from "../../store/property/propertySlice";
import {
  addToWishlist,
  changeLanguage,
  changeLanguageMode,
} from "../../store/auth/authSlice";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  getAllRegions,
  getAllSubRegions,
  getAllLocations,
} from "../../store/address/addressSlice";

// Add this new component at the top
const PropertyImages = memo(({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <View
        style={{ width: cardHeight - 24, height: cardHeight - 24, margin: 10 }}
        className="bg-gray-200 dark:bg-gray-700 rounded-xl items-center justify-center"
      >
        <Ionicons name="image-outline" size={32} color="#9CA3AF" />
      </View>
    );
  }

  return (
    <View className="relative">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / (cardHeight - 24)
          );
          setActiveIndex(newIndex);
        }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{
              width: cardHeight - 24,
              height: cardHeight - 24,
              margin: 10,
            }}
            resizeMode="cover"
            className="rounded-xl"
          />
        ))}
      </ScrollView>

      {/* Image counter */}
      {images.length > 1 && (
        <View className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded-full">
          <Text className="text-white text-xs">
            {activeIndex + 1}/{images.length}
          </Text>
        </View>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-1">
          {images.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full ${
                index === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
});

// Then modify the PropertyCard component
const PropertyCard = memo(({ item, onPress, onFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const handleFavoritePress = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite(item);
  };

  return (
    <TouchableOpacity className="mb-4 mx-4" onPress={() => onPress(item)}>
      <View
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md flex-row"
        style={{ height: cardHeight }}
      >
        <View className="relative" style={{ width: cardHeight }}>
          {/* If there are no images, show placeholder */}
          {!item.images || item.images.length === 0 ? (
            <View
              style={{
                width: cardHeight - 24,
                height: cardHeight - 24,
                margin: 10,
              }}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl items-center justify-center"
            >
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            </View>
          ) : // If there's only one image, show it directly
          item.images.length === 1 ? (
            <Image
              source={{ uri: item.images[0] }}
              style={{
                width: cardHeight - 24,
                height: cardHeight - 24,
                margin: 10,
              }}
              resizeMode="cover"
              className="rounded-xl"
            />
          ) : (
            // If there are multiple images, use the PropertyImages component
            <PropertyImages images={item.images} />
          )}
          <View className="absolute top-2 right-2 bg-green-500/90 dark:bg-green-600/90 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">
              {item.property_use === "rent" ? "For Rent" : "For Sale"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleFavoritePress}
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#EF4444" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Rest of the component stays the same */}
      </View>
    </TouchableOpacity>
  );
});

// Memoize the PropertyItem component to prevent unnecessary re-renders
const PropertyItem = memo(({ item, onPress, onFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const handleFavoritePress = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite(item);
  };

  // Format location string
  const locationString = [
    // item.address?.region?.region_name,
    item.address?.subregion?.subregion_name,
    item.address?.location?.location,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mx-2 w-72"
    >
      {/* Image Container */}
      <View className="relative">
        {!item.images || item.images.length === 0 ? (
          <View className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4 justify-center items-center">
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          </View>
        ) : (
          <View className="relative h-48 rounded-xl mb-4 overflow-hidden">
            <Image
              source={{ uri: item.images[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Price Badge */}
            <View className="absolute top-2 left-2 bg-black/60 px-3 py-1.5 rounded-full">
              <Text className="text-white font-bold">
                ETB {item.price?.toLocaleString()}
              </Text>
            </View>
            {/* Favorite Button */}
            <TouchableOpacity
              onPress={handleFavoritePress}
              className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#EF4444" : "#6B7280"}
              />
            </TouchableOpacity>
            {/* Views Badge */}
            <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-full flex-row items-center">
              <Ionicons name="eye-outline" size={14} color="white" />
              <Text className="text-white text-xs ml-1">
                {item.views?.count || 0}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Content */}
      <View>
        {/* Title */}
        <Text
          className="text-lg font-bold text-gray-800 dark:text-white mb-2"
          numberOfLines={1}
        >
          {item.title}
        </Text>

        {/* Location */}
        <View className="flex-row items-start">
          <Ionicons
            name="location-outline"
            size={14}
            color="#6B7280"
            className="mt-1"
          />
          <Text
            className="text-gray-500 dark:text-gray-400 ml-1 flex-1"
            numberOfLines={2}
          >
            {locationString}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Create a separate memoized modal component
const PropertyModal = memo(
  ({
    visible,
    onClose,
    property,
    favouriteOn,
    onFavourite,
    onBuy,
    isPurchasing,
    showPaymentOptions,
    setShowPaymentOptions,
    paymentMethod,
    setPaymentMethod,
  }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!visible || !property) return null;

    // Format location string
    const locationString = [
      property?.address?.region?.region_name,
      property?.address?.subregion?.subregion_name,
      property?.address?.location?.location_name,
    ]
      .filter(Boolean)
      .join(", ");

    // Filter typeSpecificFields to only show fields with data
    const validTypeSpecificFields = Object.entries(
      property.typeSpecificFields || {}
    )
      .filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          value !== false &&
          value !== ""
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden">
            {/* Header with close button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <ScrollView className="flex-1">
              {/* Image Gallery */}
              <View className="relative h-72">
                {property.images && property.images.length > 0 ? (
                  <>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onMomentumScrollEnd={(e) => {
                        const newIndex = Math.round(
                          e.nativeEvent.contentOffset.x /
                            Dimensions.get("window").width
                        );
                        setActiveImageIndex(newIndex);
                      }}
                    >
                      {property.images.map((image, index) => (
                        <Image
                          key={index}
                          source={{ uri: image }}
                          className="w-screen h-72"
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                    {/* Image counter */}
                    <View className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs">
                        {activeImageIndex + 1}/{property.images.length}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View className="w-full h-72 bg-gray-200 dark:bg-gray-700 items-center justify-center">
                    <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                  </View>
                )}
              </View>

              {/* Content */}
              <View className="p-6">
                {/* Title and Price Row */}
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {property.title}
                    </Text>
                    <Text className="text-xl font-bold text-[#FF8E01]">
                      ETB {property.price?.toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={onFavourite}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"
                  >
                    <Ionicons
                      name={favouriteOn ? "heart" : "heart-outline"}
                      size={24}
                      color={favouriteOn ? "#EF4444" : "#6B7280"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Location */}
                {locationString && (
                  <View className="flex-row items-start mb-4">
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#6B7280"
                    />
                    <Text className="text-gray-600 dark:text-gray-300 ml-2 flex-1">
                      {locationString}
                    </Text>
                  </View>
                )}

                {/* Property Details */}
                {(property.propertyType?.name ||
                  property.status ||
                  Object.keys(validTypeSpecificFields).length > 0) && (
                  <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Property Details
                    </Text>
                    <View className="flex-row flex-wrap">
                      {property.propertyType?.name && (
                        <View className="w-1/2 mb-3">
                          <Text className="text-gray-500 dark:text-gray-400">
                            Type
                          </Text>
                          <Text className="text-gray-800 dark:text-white font-medium">
                            {property.propertyType.name}
                          </Text>
                        </View>
                      )}
                      {property.status && (
                        <View className="w-1/2 mb-3">
                          <Text className="text-gray-500 dark:text-gray-400">
                            Status
                          </Text>
                          <Text className="text-gray-800 dark:text-white font-medium capitalize">
                            {property.status}
                          </Text>
                        </View>
                      )}
                      {Object.entries(validTypeSpecificFields).map(
                        ([key, value]) => (
                          <View key={key} className="w-1/2 mb-3">
                            <Text className="text-gray-500 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </Text>
                            <Text className="text-gray-800 dark:text-white font-medium">
                              {value} {key.includes("area") ? "m²" : ""}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  </View>
                )}

                {/* Description */}
                {property.description && (
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Description
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300">
                      {property.description}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Bottom Action Button */}
            <View className="p-5 border-t border-gray-200 dark:border-gray-800">
              {property?.property_use === "rent" ? (
                // For Rental Properties - Show Contact Info
                <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <Text
                    className="text-gray-800 dark:text-white font-semibold mb-2"
                    onPress={() => console.log(property.owner)}
                  >
                    Contact Owner
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="call-outline" size={20} color="#6B7280" />
                      <Text className="text-gray-600 dark:text-gray-300 ml-2">
                        {property?.owner?.phone || "Phone not available"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`tel:${property?.owner?.phone}`)
                      }
                      className="bg-[#FF8E01] px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-medium">Call Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : // For Sale Properties - Show Payment Options
              showPaymentOptions ? (
                <View>
                  <PaymentMethodSelector
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                  <TouchableOpacity
                    onPress={onBuy}
                    disabled={isPurchasing}
                    className={`${
                      isPurchasing ? "bg-gray-400" : "bg-[#FF8E01]"
                    } rounded-xl py-4 px-6`}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-semibold text-base">
                        Confirm Purchase
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
                    Buy Property
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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
    dispatch(getAllViews());
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
  }, []);

  const { propertiesByUse, views, isSuccess } = useSelector(
    (state) => state.property
  );

  const { t, i18n } = useTranslation();

  // Memoize callback functions
  const handleFavourite = useCallback(
    async (prop) => {
      try {
        setFavouriteOn(!favouriteOn); // Immediately update UI
        const data = {
          prodId: prop._id,
        };
        await dispatch(addToWishlist(data)).unwrap();
      } catch (error) {
        console.error("Error updating favorite:", error);
        setFavouriteOn(favouriteOn); // Revert on error
      }
    },
    [favouriteOn, dispatch]
  );

  const handlePress = useCallback(
    async (prop) => {
      try {
        const data = {
          propertyId: prop._id,
        };
        setSelectedProperty(prop);
        setFavouriteOn(prop.isFavorite);
        setModalVisible(true);
        setShowPaymentOptions(false);

        // Dispatch the view change and handle any errors
        await dispatch(changeView(data)).unwrap();
      } catch (error) {
        // Silently handle the error or show a toast message
        console.log("Error updating view:", error);
      }
    },
    [dispatch]
  );

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
    {
      icon: "home-outline",
      label: t("apartment"),
      type: "Apartment",
      color: "#FF8E01", // or any color you prefer
    },
    {
      icon: "car-outline",
      label: t("cars"),
      type: "Vehicle",
      color: "#4CAF50",
    },
    {
      icon: "map-outline",
      label: t("land"),
      type: "Land",
      color: "#2196F3",
    },
    {
      icon: "business-outline",
      label: t("villas"),
      type: "Villa",
      color: "#9C27B0",
    },
    {
      icon: "storefront-outline",
      label: t("commercial"),
      type: "Commercial",
      color: "#E91E63",
    },
    {
      icon: "grid-outline",
      label: t("office"),
      type: "Office",
      color: "#FF5722",
    },
    {
      icon: "home",
      label: t("houses"),
      type: "House",
      color: "#795548",
    },
  ];

  const handleCategoryPress = (category) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: { filterType: category.type },
    });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      className="items-center mx-3 mb-4"
      onPress={() => handleCategoryPress(item)}
    >
      <View
        className="w-16 h-16 rounded-2xl mb-1 items-center justify-center"
        style={{
          backgroundColor: `${item.color}15`, // 15 is hex for 10% opacity
          borderWidth: 1,
          borderColor: `${item.color}30`, // 30 is hex for 20% opacity
        }}
      >
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text className="text-xs text-gray-600 dark:text-gray-300 mt-1">
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

  // Add error handling for the modal visibility state
  useEffect(() => {
    if (!modalVisible) {
      setSelectedProperty(null);
      setShowPaymentOptions(false);
      setPaymentMethod("cash");
    }
  }, [modalVisible]);

  // In the PropertyModal component, add error handling for the close action
  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedProperty(null);
    setShowPaymentOptions(false);
    setPaymentMethod("cash");
  }, []);

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] flex-1">
      <View className="px-5 pt-5">
        {/* Header with Language Selection and Notification */}
        <View className="flex flex-row justify-between items-center mb-4">
          <Text
            className="text-2xl font-bold dark:text-slate-300"
            onPress={() => console.log(views)}
          >
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
      {/* <Text>{t("welcome")}</Text> */}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Categories */}
        <View className="mt-6">
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.type}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
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
            title={t("available_for_sell")}
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
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={296} // 280 (card width) + 16 (separator width)
          />
        </View>

        {/* Rent Properties Section */}
        <View className="mb-6">
          <SectionHeader
            title={t("available_for_rent")}
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
      <PropertyModal
        visible={modalVisible}
        onClose={handleModalClose}
        property={selectedProperty}
        favouriteOn={favouriteOn}
        onFavourite={handleFavourite}
        onBuy={handleBuyProperty}
        onScheduleVisit={handleScheduleVisit}
        isPurchasing={isPurchasing}
        showPaymentOptions={showPaymentOptions}
        setShowPaymentOptions={setShowPaymentOptions}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </View>
  );
};

export default memo(Home);
