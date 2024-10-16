import { View, Text, FlatList, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../store/property/propertySlice";

const Explore = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const obj = {
      limit: parseInt(limit),
    };
    dispatch(getAllProperties(obj));
  }, [limit]);

  const onLimitChange = (e) => {
    if (e.nativeEvent.key === "Enter") {
      const value = parseInt(e.nativeEvent.text, 10);
      if (!isNaN(value)) {
        setLimit(value);
      } else {
        setLimit(10);
      }
    }
  };

  const { user } = useSelector((state) => state.auth);
  const { properties } = useSelector((state) => state.property);

  const renderProperties = ({ item }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <Text className="text-lg font-semibold dark:text-white">{item.name}</Text>
      <Text className="text-gray-600 dark:text-gray-300">
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-xl font-bold dark:text-slate-300 mb-4">
        Explore
      </Text>

      <View className="flex-row items-center mb-4">
        <Text className="dark:text-white mr-2">Limit:</Text>
        <TextInput
          placeholder={`Current limit: ${limit}`}
          keyboardType="numeric"
          onSubmitEditing={onLimitChange}
          className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 dark:text-white"
          placeholderTextColor="#A0AEC0" // Placeholder color for light and dark mode
        />
      </View>

      <FlatList
        data={properties?.properties}
        keyExtractor={(item) => item._id}
        renderItem={renderProperties}
        contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom of the list
      />
    </View>
  );
};

export default Explore;
