import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../store/property/propertySlice";
import { Ionicons } from "@expo/vector-icons"; // Import icons

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

  const renderProperties = ({ item }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 flex flex-row justify-between">
      <View>
        <Text className="text-lg font-semibold dark:text-white">
          {item.name}
        </Text>
        <Text className="text-gray-600 dark:text-gray-300">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text className="text-lg font-semibold dark:text-white">
        {item.price} birr
      </Text>
    </View>
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

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-blue-500 p-3 rounded-lg mb-4"
      >
        <Text className="text-white text-center">Filter Properties</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 dark:bg-gray-800 p-5">
          <Text className="text-xl font-bold dark:text-white mb-4">
            Filter Options
          </Text>

          {/* Limit Input */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="filter" size={24} color="white" />
            <Text className="dark:text-white ml-2">Limit:</Text>
            <TextInput
              placeholder={`Current limit: ${limit}`}
              keyboardType="numeric"
              onSubmitEditing={setLimit}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white ml-2"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          {/* Price Range Inputs */}
          <View className="mb-4">
            <Text className="dark:text-white mb-2">Price Range:</Text>
            <View className="flex-row">
              <TextInput
                placeholder="Min Price"
                keyboardType="numeric"
                value={minPrice}
                onChangeText={setMinPrice}
                className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white w-1/2 mr-2"
                placeholderTextColor="#A0AEC0"
              />
              <TextInput
                placeholder="Max Price"
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={setMaxPrice}
                className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white w-1/2"
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          {/* Location Input */}
          <View className="mb-4">
            <Text className="dark:text-white mb-2">Location:</Text>
            <TextInput
              placeholder="Enter location"
              value={location}
              onChangeText={setLocation}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          {/* Property Type Input */}
          <View className="mb-4">
            <Text className="dark:text-white mb-2">Property Type:</Text>
            <TextInput
              placeholder="Enter property type"
              value={propertyType}
              onChangeText={setPropertyType}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          {/* Bedrooms Input */}
          <View className="mb-4">
            <Text className="dark:text-white mb-2">Bedrooms:</Text>
            <TextInput
              placeholder="Number of bedrooms"
              keyboardType="numeric"
              value={bedrooms}
              onChangeText={setBedrooms}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-red-500 p-3 rounded-lg mb-4"
          >
            <Text className="text-white text-center">Close Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={properties?.properties}
        keyExtractor={(item) => item._id}
        renderItem={renderProperties}
        vertical
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Explore;
