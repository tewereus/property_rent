import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback, memo } from "react";
import {
  changeFeatured,
  getUserProperties,
} from "../../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const cardHeight = 160;

// Memoize the PropertyCard component
const PropertyCard = memo(({ item, onPress, handleBoost }) => (
  <TouchableOpacity className="mb-4 mx-4" onPress={() => onPress(item)}>
    <View
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md flex-row"
      style={{ height: cardHeight }}
    >
      <View className="relative" style={{ width: cardHeight }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: cardHeight - 24,
            height: cardHeight - 24,
            margin: 10,
          }}
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-green-500/90 dark:bg-green-600/90 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            {item.property_use === "rent" ? "For Rent" : "For Sale"}
          </Text>
        </View>
      </View>

      <View className="flex-1 p-4 justify-between">
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-blue-600 dark:text-blue-400 font-bold text-lg">
              ${item.price || "0"}
            </Text>
            <View className="bg-blue-500 dark:bg-blue-900 px-2 py-1 rounded-full">
              <TouchableOpacity onPress={() => handleBoost(item)}>
                <Text className="text-white px-2">Boost</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            className="text-lg font-bold text-gray-800 dark:text-white mb-1"
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="location-sharp" size={14} color="#6B7280" />
            <Text
              className="text-gray-500 dark:text-gray-400 ml-1 text-sm"
              numberOfLines={1}
            >
              {item.location}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Posted {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

const Listing = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const router = useRouter();

  useEffect(() => {
    dispatch(getUserProperties());
  }, [dispatch]);

  const { userProperties } = useSelector((state) => state.property);

  const handlePropertyPress = useCallback((property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  }, []);

  const handleBoostProperty = useCallback(
    (property) => {
      router.push({
        pathname: "/boost_payment",
        params: { propertyId: property._id },
      });
    },
    [router]
  );

  const renderProperties = useCallback(
    ({ item }) => (
      <PropertyCard
        item={item}
        onPress={handlePropertyPress}
        handleBoost={handleBoostProperty}
      />
    ),
    [handlePropertyPress]
  );

  return (
    <View className="flex-1 bg-gray-100 dark:bg-[#09092B]">
      <View className="px-5 pt-8 pb-4">
        <Text className="text-3xl font-bold text-gray-800 dark:text-white">
          My Listings
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1 text-base">
          {userProperties?.properties?.length || 0} active properties
        </Text>
      </View>

      {userProperties?.properties?.length > 0 ? (
        <FlatList
          data={userProperties?.properties}
          keyExtractor={(item) => item._id}
          renderItem={renderProperties}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={5}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="home-outline" size={48} color="#6B7280" />
          <Text className="text-gray-500 dark:text-gray-400 text-lg mt-4">
            No listings posted yet
          </Text>
        </View>
      )}

      {modalVisible && (
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-white dark:bg-gray-900">
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
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
              >
                <Image
                  source={{ uri: selectedProperty.image }}
                  className="w-screen h-72"
                  resizeMode="cover"
                />

                <View className="p-5">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${selectedProperty.price}
                    </Text>
                    <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full">
                      <Text className="text-blue-600 dark:text-blue-400 font-medium">
                        {selectedProperty.propertyType}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {selectedProperty.title}
                  </Text>

                  <View className="flex-row items-center mb-4">
                    <Ionicons name="location" size={20} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 ml-2 text-base">
                      {selectedProperty.location}
                    </Text>
                  </View>

                  <View className="flex-row justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                    <View className="items-center">
                      <Ionicons name="bed-outline" size={24} color="#6B7280" />
                      <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {selectedProperty.bedrooms || "3"} Beds
                      </Text>
                    </View>
                    <View className="items-center">
                      <Ionicons
                        name="water-outline"
                        size={24}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {selectedProperty.bathrooms || "2"} Baths
                      </Text>
                    </View>
                    <View className="items-center">
                      <Ionicons
                        name="square-outline"
                        size={24}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {selectedProperty.area || "1,200"} sqft
                      </Text>
                    </View>
                  </View>

                  <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Description
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedProperty.description || "No description available"}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View className="p-5 border-t border-gray-200 dark:border-gray-800">
              <TouchableOpacity
                className="bg-[#FF8E01] rounded-xl py-4 px-6"
                onPress={() => {
                  setModalVisible(false);
                  router.push({
                    pathname: "/edit_property",
                    params: { property: JSON.stringify(selectedProperty) },
                  });
                }}
              >
                <Text className="text-white text-center font-semibold text-base">
                  Edit Property
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default memo(Listing);
