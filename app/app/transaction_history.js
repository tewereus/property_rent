import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUserTransactions } from "../store/property/propertySlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getIconForField, getUnitForField } from "../assets/utils";
import { Linking } from "react-native";

// Property Images Component
const PropertyImages = memo(({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <View className="bg-gray-200 dark:bg-gray-700 h-20 w-20 rounded-lg items-center justify-center">
        <Ionicons name="image-outline" size={24} color="#9CA3AF" />
      </View>
    );
  }

  return (
    <View className="relative h-20 w-20">
      <Image
        source={{ uri: images[0] }}
        className="h-20 w-20 rounded-lg"
        resizeMode="cover"
      />
      {images.length > 1 && (
        <View className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded-full">
          <Text className="text-white text-xs">+{images.length - 1}</Text>
        </View>
      )}
    </View>
  );
});

// Property Modal Component
const PropertyModal = memo(({ visible, onClose, property }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!visible || !property) return null;

  // Format location string
  const locationString = [
    property?.address?.region?.region_name,
    property?.address?.subregion?.subregion_name,
    property?.address?.location?.location,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden">
          {/* Close Button */}
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
                  {/* Dot indicators */}
                  <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-1">
                    {property.images.map((_, index) => (
                      <View
                        key={index}
                        className={`h-1.5 rounded-full ${
                          index === activeImageIndex
                            ? "w-4 bg-white"
                            : "w-1.5 bg-white/60"
                        }`}
                      />
                    ))}
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
              {/* Title and Price */}
              <View className="mb-4">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {property.name}
                </Text>
                <Text className="text-xl font-bold text-[#FF8E01]">
                  ETB {property.price?.toLocaleString()}
                </Text>
              </View>

              {/* Location */}
              {locationString && (
                <View className="flex-row items-start mb-4">
                  <Ionicons name="location-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2 flex-1">
                    {locationString}
                  </Text>
                </View>
              )}

              {/* Property Details */}
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
                  <View className="w-1/2 mb-3">
                    <Text className="text-gray-500 dark:text-gray-400">
                      Status
                    </Text>
                    <Text className="text-gray-800 dark:text-white font-medium capitalize">
                      {property.property_use === "rent"
                        ? "For Rent"
                        : "For Sale"}
                    </Text>
                  </View>
                  {/* Dynamic Property Fields */}
                  {Object.entries(property.typeSpecificFields || {}).map(
                    ([key, value]) => {
                      if (
                        value === null ||
                        value === undefined ||
                        value === false ||
                        value === ""
                      ) {
                        return null;
                      }
                      return (
                        <View key={key} className="w-1/2 mb-3">
                          <Text className="text-gray-500 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </Text>
                          <View className="flex-row items-center">
                            <Ionicons
                              name={getIconForField(key)}
                              size={16}
                              color="#6B7280"
                              style={{ marginRight: 4 }}
                            />
                            <Text className="text-gray-800 dark:text-white font-medium">
                              {value}
                              {getUnitForField(key)}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  )}
                </View>
              </View>

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
        </View>
      </View>
    </Modal>
  );
});

// Transaction History Item Component
const TransactionHistoryItem = ({ transaction }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        className="bg-white dark:bg-gray-700 p-4 rounded-2xl mb-4 shadow-sm mx-4"
        onPress={() => setModalVisible(true)}
      >
        <View className="flex-row">
          {/* Property Image */}
          <PropertyImages images={transaction.property?.images} />

          {/* Transaction Details */}
          <View className="flex-1 ml-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                {transaction.property?.name || "Property"}
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  transaction.status === "completed"
                    ? "bg-green-100 dark:bg-green-800"
                    : transaction.status === "pending"
                    ? "bg-yellow-100 dark:bg-yellow-800"
                    : "bg-red-100 dark:bg-red-800"
                }`}
              >
                <Text
                  className={`text-sm capitalize ${
                    transaction.status === "completed"
                      ? "text-green-800 dark:text-green-200"
                      : transaction.status === "pending"
                      ? "text-yellow-800 dark:text-yellow-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {/* {transaction.status} */}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons name="cash-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-300 ml-2">
                ETB {transaction.amount.toLocaleString()}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 ml-4 text-sm">
                via {transaction.paymentMethod.replace("_", " ")}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    transaction.transactionType === "rent"
                      ? "key-outline"
                      : "home-outline"
                  }
                  size={16}
                  color="#6B7280"
                />
                <Text className="text-gray-500 dark:text-gray-400 ml-2 capitalize">
                  {transaction.transactionType}
                </Text>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {transaction.notes && (
              <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm italic">
                {transaction.notes}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <PropertyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        property={transaction.property}
      />
    </>
  );
};

// Main Component
const TransactionHistory = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.property);

  useEffect(() => {
    dispatch(getUserTransactions());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 p-4 flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800 dark:text-white">
          Transaction History
        </Text>
      </View>

      {/* Transactions List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {transactions?.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionHistoryItem
                key={transaction._id}
                transaction={transaction}
              />
            ))
          ) : (
            <Text className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No transactions yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionHistory;
