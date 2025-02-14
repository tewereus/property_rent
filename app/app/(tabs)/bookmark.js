import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getWishlists, addToWishlist } from "../../store/auth/authSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { buyProperty } from "../../store/property/propertySlice";
import { initializePayment } from "../../store/payment/paymentSlice";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32; // Full width minus padding
const CARD_IMAGE_HEIGHT = SCREEN_WIDTH * 0.5; // 50% of screen width for image height

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  const methods = [
    { id: "telebirr", name: "TeleBirr", icon: "phone-portrait-outline" },
    { id: "cbe", name: "CBE Birr", icon: "card-outline" },
    { id: "cash", name: "Cash", icon: "cash-outline" },
  ];

  return (
    <View className="mb-6">
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => setPaymentMethod(method.id)}
          className={`flex-row items-center p-4 mb-3 rounded-xl border ${
            paymentMethod === method.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <Ionicons
            name={method.icon}
            size={24}
            color={paymentMethod === method.id ? "#3B82F6" : "#6B7280"}
          />
          <Text
            className={`ml-3 font-medium ${
              paymentMethod === method.id
                ? "text-blue-500 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {method.name}
          </Text>
          <View className="ml-auto">
            <Ionicons
              name={
                paymentMethod === method.id
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color={paymentMethod === method.id ? "#3B82F6" : "#6B7280"}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const WishlistItem = memo(({ item, onPress, onFavorite }) => {
  // Format location string
  const locationString = [
    item?.address?.subregion?.subregion_name,
    item?.address?.location?.location,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mx-4 mb-4"
      style={{ width: CARD_WIDTH }}
    >
      {/* Image Container */}
      <View className="relative">
        {!item.images || item.images.length === 0 ? (
          <View
            style={{ height: CARD_IMAGE_HEIGHT }}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 justify-center items-center"
          >
            <Ionicons
              name="image-outline"
              size={SCREEN_WIDTH * 0.08}
              color="#9CA3AF"
            />
          </View>
        ) : (
          <View
            style={{ height: CARD_IMAGE_HEIGHT }}
            className="relative rounded-xl mb-4 overflow-hidden"
          >
            <Image
              source={{ uri: item.images[0] }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Price Badge */}
            <View className="absolute top-2 left-2 bg-black/60 px-3 py-1.5 rounded-full">
              <Text
                className="text-white font-bold"
                style={{ fontSize: SCREEN_WIDTH * 0.035 }}
              >
                ETB {item.price?.toLocaleString()}
              </Text>
            </View>
            {/* Property Type Badge */}
            <View className="absolute top-2 right-2 bg-green-500/90 dark:bg-green-600/90 px-2 py-1 rounded-full">
              <Text
                className="text-white font-medium"
                style={{ fontSize: SCREEN_WIDTH * 0.03 }}
              >
                For {item.property_use === "rent" ? "Rent" : "Sale"}
              </Text>
            </View>
            {/* Remove Button */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onFavorite(item);
              }}
              className="absolute top-12 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
            >
              <Ionicons
                name="close"
                size={SCREEN_WIDTH * 0.05}
                color="#EF4444"
              />
            </TouchableOpacity>
            {/* Views Badge */}
            <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-full flex-row items-center">
              <Ionicons
                name="eye-outline"
                size={SCREEN_WIDTH * 0.035}
                color="white"
              />
              <Text
                className="text-white ml-1"
                style={{ fontSize: SCREEN_WIDTH * 0.03 }}
              >
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
          className="font-bold text-gray-800 dark:text-white mb-2"
          style={{ fontSize: SCREEN_WIDTH * 0.045 }}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        {/* Location */}
        <View className="flex-row items-start">
          <Ionicons
            name="location-outline"
            size={SCREEN_WIDTH * 0.035}
            color="#6B7280"
            className="mt-1"
          />
          <Text
            className="text-gray-500 dark:text-gray-400 ml-1 flex-1"
            style={{ fontSize: SCREEN_WIDTH * 0.035 }}
            numberOfLines={2}
          >
            {locationString}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const PropertyModal = memo(
  ({
    visible,
    onClose,
    property,
    onRemove,
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
              <Ionicons name="close" size={SCREEN_WIDTH * 0.06} color="white" />
            </TouchableOpacity>

            <ScrollView className="flex-1">
              {/* Image Gallery */}
              <View style={{ height: SCREEN_HEIGHT * 0.4 }}>
                {property.images && property.images.length > 0 ? (
                  <>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onMomentumScrollEnd={(e) => {
                        const newIndex = Math.round(
                          e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                        );
                        setActiveImageIndex(newIndex);
                      }}
                    >
                      {property.images.map((image, index) => (
                        <Image
                          key={index}
                          source={{ uri: image }}
                          style={{
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT * 0.4,
                          }}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                    {/* Image counter */}
                    <View className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded-full">
                      <Text
                        className="text-white"
                        style={{ fontSize: SCREEN_WIDTH * 0.03 }}
                      >
                        {activeImageIndex + 1}/{property.images.length}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View className="w-full h-full bg-gray-200 dark:bg-gray-700 items-center justify-center">
                    <Ionicons
                      name="image-outline"
                      size={SCREEN_WIDTH * 0.12}
                      color="#9CA3AF"
                    />
                  </View>
                )}
              </View>

              {/* Content */}
              <View className="p-6">
                {/* Title and Price Row */}
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text
                      className="font-bold text-gray-800 dark:text-white mb-2"
                      style={{ fontSize: SCREEN_WIDTH * 0.06 }}
                    >
                      {property.title}
                    </Text>
                    <Text
                      className="font-bold text-[#FF8E01]"
                      style={{ fontSize: SCREEN_WIDTH * 0.05 }}
                    >
                      ETB {property.price?.toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onRemove(property)}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"
                  >
                    <Ionicons
                      name="close"
                      size={SCREEN_WIDTH * 0.06}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>

                {/* Location */}
                {locationString && (
                  <View className="flex-row items-start mb-4">
                    <Ionicons
                      name="location-outline"
                      size={SCREEN_WIDTH * 0.035}
                      color="#6B7280"
                      className="mt-1"
                    />
                    <Text
                      className="text-gray-600 dark:text-gray-300 ml-2 flex-1"
                      style={{ fontSize: SCREEN_WIDTH * 0.035 }}
                    >
                      {locationString}
                    </Text>
                  </View>
                )}

                {/* Property Details */}
                {(property.propertyType?.name ||
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
                    style={{ fontSize: SCREEN_WIDTH * 0.04 }}
                  >
                    Contact Owner
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="call-outline"
                        size={SCREEN_WIDTH * 0.05}
                        color="#6B7280"
                      />
                      <Text
                        className="text-gray-600 dark:text-gray-300 ml-2"
                        style={{ fontSize: SCREEN_WIDTH * 0.035 }}
                      >
                        {property?.owner?.phone || "Phone not available"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`tel:${property?.owner?.phone}`)
                      }
                      className="bg-[#FF8E01] px-4 py-2 rounded-lg"
                    >
                      <Text
                        className="text-white font-medium"
                        style={{ fontSize: SCREEN_WIDTH * 0.035 }}
                      >
                        Call Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : // For Sale Properties - Show Buy Button
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
                      <Text
                        className="text-white text-center font-semibold"
                        style={{ fontSize: SCREEN_WIDTH * 0.04 }}
                      >
                        Confirm Purchase
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-[#FF8E01] rounded-xl py-4 px-6"
                  onPress={() => setShowPaymentOptions(true)}
                >
                  <Text
                    className="text-white text-center font-semibold"
                    style={{ fontSize: SCREEN_WIDTH * 0.04 }}
                  >
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

const Bookmark = () => {
  const dispatch = useDispatch();
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favouriteOn, setFavouriteOn] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      dispatch(getWishlists());
    }, [dispatch])
  );

  const { wishlist } = useSelector((state) => state.auth);

  const handleFavourite = useCallback(() => {
    const data = {
      prodId: selectedWishlist?._id,
    };
    dispatch(addToWishlist(data))
      .unwrap()
      .then(() => {
        setFavouriteOn(!favouriteOn);
        dispatch(getWishlists());
      })
      .catch((error) => {
        console.error("Error updating favorite:", error);
        setFavouriteOn(favouriteOn);
      });
  }, [selectedWishlist, favouriteOn, dispatch]);

  const handleWishlist = useCallback((wish) => {
    setSelectedWishlist(wish);
    setFavouriteOn(true);
    setModalVisible(true);
  }, []);

  const handleRemoveFromWishlist = useCallback(
    (item) => {
      const data = {
        prodId: item._id,
      };
      dispatch(addToWishlist(data))
        .unwrap()
        .then(() => {
          dispatch(getWishlists());
        });
    },
    [dispatch]
  );

  const handleBuyProperty = async () => {
    if (!selectedWishlist?._id) return;

    setIsPurchasing(true);
    try {
      console.log(
        "Starting payment process for property:",
        selectedWishlist._id
      );

      const paymentData = {
        amount: 1000,
        propertyId: selectedWishlist._id,
        paymentMethod: paymentMethod,
        transactionType:
          selectedWishlist.property_use === "rent" ? "rent" : "purchase",
      };

      const response = await dispatch(initializePayment(paymentData)).unwrap();
      console.log("Payment initialization response:", response);

      if (!response?.paymentUrl) {
        throw new Error("Payment URL not received from server");
      }

      // Close modals
      setModalVisible(false);
      setShowPaymentOptions(false);
      setPaymentMethod("cash");

      // Navigate to WebView with payment URL
      router.push({
        pathname: "/payment-webview",
        params: {
          paymentUrl: response.paymentUrl,
          tx_ref: response.tx_ref,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Error",
        error?.message || "Failed to initiate payment. Please try again later."
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const renderWishlist = useCallback(
    ({ item }) => (
      <WishlistItem
        item={item}
        onPress={handleWishlist}
        onFavorite={handleRemoveFromWishlist}
      />
    ),
    [handleWishlist, handleRemoveFromWishlist]
  );

  return (
    <View className="flex-1 bg-gray-100 dark:bg-[#09092B]">
      <View className="px-5 pt-8 pb-4">
        <Text
          className="font-bold text-gray-800 dark:text-white"
          style={{ fontSize: SCREEN_WIDTH * 0.08 }}
        >
          Favorites
        </Text>
        <Text
          className="text-gray-500 dark:text-gray-400 mt-1"
          style={{ fontSize: SCREEN_WIDTH * 0.04 }}
        >
          {wishlist?.wishlist?.length || 0} saved properties
        </Text>
      </View>

      <FlatList
        data={wishlist?.wishlist}
        keyExtractor={(item) => item._id}
        renderItem={renderWishlist}
        contentContainerStyle={{
          paddingVertical: SCREEN_WIDTH * 0.025,
        }}
        showsVerticalScrollIndicator={false}
      />

      <PropertyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        property={selectedWishlist}
        onRemove={handleRemoveFromWishlist}
        onBuy={handleBuyProperty}
        isPurchasing={isPurchasing}
        showPaymentOptions={showPaymentOptions}
        setShowPaymentOptions={setShowPaymentOptions}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </View>
  );
};

export default memo(Bookmark);
