import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlists, addToWishlist } from "../../store/auth/authSlice";
import Ionicons from "react-native-vector-icons/Ionicons";

const WishlistItem = memo(({ item, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-4 mx-4"
  >
    {/* Image Container */}
    <View className="relative">
      <Image
        source={{ uri: item.image }}
        className="w-full h-40"
        resizeMode="cover"
      />
      {/* Sale/Rent Tag */}
      <View className="absolute bottom-2 left-2 bg-gray-800/80 px-2 py-1 rounded">
        <Text className="text-white text-xs">
          For {item.property_use === "rent" ? "Rent" : "Sale"}
        </Text>
      </View>
      {/* Favorite Button */}
      <TouchableOpacity
        onPress={() => onPress(item)}
        className="absolute top-2 right-2"
      >
        <View className="bg-white rounded-full p-1">
          <Ionicons name="heart" size={20} color="#EF4444" />
        </View>
      </TouchableOpacity>
    </View>

    {/* Content */}
    <View className="p-3">
      <Text
        className="text-gray-800 dark:text-white font-semibold text-lg"
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
        {item.location}
      </Text>
      <View className="flex-row items-center space-x-4">
        <View className="flex-row items-center">
          <Ionicons name="bed-outline" size={14} color="#6B7280" />
          <Text className="text-gray-600 ml-1">{item.bedrooms || "3"}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="water-outline" size={14} color="#6B7280" />
          <Text className="text-gray-600 ml-1">{item.bathrooms || "2"}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="square-outline" size={14} color="#6B7280" />
          <Text className="text-gray-600 ml-1">
            {item.area || "1,200"} sq ft
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

const Bookmark = () => {
  const dispatch = useDispatch();
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favouriteOn, setFavouriteOn] = useState(true);

  useEffect(() => {
    dispatch(getWishlists());
  }, [dispatch]);

  const { wishlist } = useSelector((state) => state.auth);

  const handleWishlist = useCallback((wish) => {
    setSelectedWishlist(wish);
    setFavouriteOn(true);
    setModalVisible(true);
  }, []);

  const handleFavourite = useCallback(() => {
    const data = {
      prodId: selectedWishlist?._id,
    };
    dispatch(addToWishlist(data))
      .unwrap()
      .then((response) => {
        if (response.payload) {
          setFavouriteOn(!favouriteOn);
          dispatch(getWishlists());
        }
      });
  }, [selectedWishlist, favouriteOn, dispatch]);

  const renderWishlist = useCallback(
    ({ item }) => <WishlistItem item={item} onPress={handleWishlist} />,
    [handleWishlist]
  );

  return (
    <View className="flex-1 bg-gray-100 dark:bg-[#09092B]">
      <View className="px-5 pt-8 pb-4">
        <Text className="text-3xl font-bold text-gray-800 dark:text-white">
          Favorites
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1 text-base">
          {wishlist?.wishlist?.length || 0} saved properties
        </Text>
      </View>

      <FlatList
        data={wishlist?.wishlist}
        keyExtractor={(item) => item._id}
        renderItem={renderWishlist}
        contentContainerStyle={{
          paddingVertical: 10,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
      />

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

            {selectedWishlist && (
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
              >
                {/* Property Images */}
                <Image
                  source={{ uri: selectedWishlist.image }}
                  className="w-full h-80"
                  resizeMode="cover"
                />

                {/* Content */}
                <View className="p-5">
                  {/* Price and Favorite */}
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${selectedWishlist.price}
                    </Text>
                    <TouchableOpacity
                      onPress={handleFavourite}
                      className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
                    >
                      <Ionicons
                        name={favouriteOn ? "heart" : "heart-outline"}
                        size={24}
                        color={favouriteOn ? "#EF4444" : "#6B7280"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Property Name */}
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {selectedWishlist.name}
                  </Text>

                  {/* Location */}
                  <View className="flex-row items-center mb-4">
                    <Ionicons name="location" size={20} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 ml-2 text-base">
                      {selectedWishlist.location}
                    </Text>
                  </View>

                  {/* Property Features */}
                  <View className="flex-row justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                    <View className="items-center">
                      <Ionicons name="bed-outline" size={24} color="#6B7280" />
                      <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {selectedWishlist.bedrooms || "3"} Beds
                      </Text>
                    </View>
                    <View className="items-center">
                      <Ionicons
                        name="water-outline"
                        size={24}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {selectedWishlist.bathrooms || "2"} Baths
                      </Text>
                    </View>
                    <View className="items-center">
                      <Ionicons
                        name="square-outline"
                        size={24}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 dark:text-gray-300 mt-1">
                        {selectedWishlist.area || "1,200"} sqft
                      </Text>
                    </View>
                  </View>

                  {/* Description */}
                  <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Description
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedWishlist.description || "No description available"}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View className="p-5 border-t border-gray-200 dark:border-gray-800">
              <TouchableOpacity className="bg-blue-600 dark:bg-blue-500 py-4 px-6 rounded-2xl flex-row justify-center items-center">
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white text-lg font-semibold ml-2">
                  Contact Agent
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default memo(Bookmark);
