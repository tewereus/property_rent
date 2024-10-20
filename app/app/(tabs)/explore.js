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

const Explore = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [limit, setLimit] = useState(5);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const obj = {
      limit: parseInt(limit),
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
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
    };
    dispatch(getAllProperties(obj));
    setModalVisible(false);
  };

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-xl font-bold dark:text-slate-300 mb-4">
        Explore
      </Text>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text className="dark:text-white">Filter</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 dark:bg-gray-800 p-5">
          <View className="flex-row items-center mb-4">
            <Text className="dark:text-white mr-2">Limit:</Text>
            <TextInput
              placeholder={`Current limit: ${limit}`}
              keyboardType="numeric"
              onSubmitEditing={setLimit}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          {/* Price Range Inputs */}
          <View className="mb-4">
            <Text className="dark:text-white mr-2">Min Price:</Text>
            <TextInput
              placeholder="Min Price"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white w-1/2 mr-2"
              placeholderTextColor="#A0AEC0"
            />
            <Text className="dark:text-white mr-2">Max Price:</Text>
            <TextInput
              placeholder="Max Price"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white w-1/2"
              placeholderTextColor="#A0AEC0"
            />
          </View>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text className="dark:text-white">close filter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}>
            <Text className="dark:text-white">Filter Result</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={properties?.properties}
        keyExtractor={(item) => item._id}
        renderItem={renderProperties}
        vertical
        contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom of the list
      />
    </View>
  );
};

export default Explore;
