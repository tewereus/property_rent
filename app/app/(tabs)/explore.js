import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../store/property/propertySlice";
import { Ionicons } from "@expo/vector-icons"; // Import icons

const FilterOption = ({ icon, label, children }) => (
  <View className="mb-6">
    <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex-row items-center">
      <Ionicons
        name={icon}
        size={16}
        color="#6B7280"
        style={{ marginRight: 8 }}
      />
      {label}
    </Text>
    {children}
  </View>
);

const Explore = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [limit, setLimit] = useState(5);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  useEffect(() => {
    const obj = {
      limit: parseInt(limit),
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      location,
      propertyType,
      numBed: bedrooms ? parseInt(bedrooms) : undefined,
    };
    dispatch(getAllProperties(obj));
  }, []);

  const { properties } = useSelector((state) => state.property);

  const cardHeight = 160;

  const renderProperties = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} className="mb-4 mx-4">
      <View
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md flex-row"
        style={{ height: cardHeight }}
      >
        {/* Left: Image */}
        <View className="relative" style={{ width: cardHeight }}>
          <Image
            source={{
              uri:
                item.image ||
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
            }}
            style={{ width: cardHeight, height: cardHeight }}
            resizeMode="cover"
          />

          {/* Favorite Button */}
          <TouchableOpacity
            className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 p-1.5 rounded-full"
            onPress={() => handleFavourite(item)}
          >
            <Ionicons
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={item.isFavorite ? "#EF4444" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Right: Content */}
        <View className="flex-1 p-4 justify-between">
          {/* Top Section */}
          <View>
            {/* Price and Status */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                ${item.price}
              </Text>
              <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                <Text className="text-green-600 dark:text-green-400 text-xs font-medium">
                  Available
                </Text>
              </View>
            </View>

            {/* Property Name */}
            <Text
              className="text-lg font-bold text-gray-800 dark:text-white mb-1"
              numberOfLines={1}
            >
              {item.name}
            </Text>

            {/* Location */}
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

          {/* Bottom Section: Property Features */}
          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center">
              <Ionicons name="bed-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-300 ml-1 text-sm">
                {item.bedrooms || "3"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="water-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-300 ml-1 text-sm">
                {item.bathrooms || "2"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="square-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-300 ml-1 text-sm">
                {item.area || "1,200"} sqft
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleSubmit = () => {
    const obj = {
      limit: parseInt(limit),
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      location,
      propertyType,
      numBed: bedrooms ? parseInt(bedrooms) : undefined,
    };
    dispatch(getAllProperties(obj));
    setModalVisible(false);
  };

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-2xl font-bold dark:text-slate-300 mb-4">
        Explore Properties
      </Text>

      {/* Modern Filter Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white dark:bg-gray-800 p-4 rounded-2xl mb-4 flex-row items-center justify-between shadow-sm"
      >
        <View className="flex-row items-center">
          <Ionicons name="options-outline" size={24} color="#6B7280" />
          <Text className="text-gray-700 dark:text-white ml-3 text-base font-medium">
            Filter Properties
          </Text>
        </View>
        <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
          <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            {properties?.properties?.length || 0} Results
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modern Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/20">
          <View className="flex-1 bg-white dark:bg-gray-900 mt-24 rounded-t-3xl">
            {/* Modal Header */}
            <View className="relative border-b border-gray-200 dark:border-gray-800 p-6">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="absolute right-6 top-6 z-50 p-2 "
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Filter Properties
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Customize your search preferences
              </Text>
            </View>

            {/* Filter Content */}
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {/* Limit */}
              <FilterOption icon="filter-outline" label="Number of Results">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder={`Current limit: ${limit}`}
                    keyboardType="numeric"
                    value={limit.toString()}
                    onChangeText={(text) => setLimit(text)}
                    className="text-gray-700 dark:text-gray-300 text-base"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </FilterOption>

              {/* Price Range */}
              <FilterOption icon="cash-outline" label="Price Range">
                <View className="flex-row space-x-4">
                  <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <TextInput
                      placeholder="Min Price"
                      keyboardType="numeric"
                      value={minPrice}
                      onChangeText={setMinPrice}
                      className="text-gray-700 dark:text-gray-300"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <TextInput
                      placeholder="Max Price"
                      keyboardType="numeric"
                      value={maxPrice}
                      onChangeText={setMaxPrice}
                      className="text-gray-700 dark:text-gray-300"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                </View>
              </FilterOption>

              {/* Location */}
              <FilterOption icon="location-outline" label="Location">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder="Enter location"
                    value={location}
                    onChangeText={setLocation}
                    className="text-gray-700 dark:text-gray-300"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </FilterOption>

              {/* Property Type */}
              <FilterOption icon="home-outline" label="Property Type">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder="Enter property type"
                    value={propertyType}
                    onChangeText={setPropertyType}
                    className="text-gray-700 dark:text-gray-300"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </FilterOption>

              {/* Bedrooms */}
              <FilterOption icon="bed-outline" label="Number of Bedrooms">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder="Number of bedrooms"
                    keyboardType="numeric"
                    value={bedrooms}
                    onChangeText={setBedrooms}
                    className="text-gray-700 dark:text-gray-300"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </FilterOption>
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-6 border-t border-gray-200 dark:border-gray-800">
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl"
                >
                  <Text className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  className="flex-1 bg-blue-600 p-4 rounded-xl"
                >
                  <Text className="text-white text-center font-medium">
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={properties?.properties}
        keyExtractor={(item) => item._id}
        renderItem={renderProperties}
        contentContainerStyle={{
          paddingVertical: 10,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Explore;
