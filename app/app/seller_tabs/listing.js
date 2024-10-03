import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { getAllUsersProperties } from "../../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";

const Listing = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsersProperties());
  }, []);

  const { properties } = useSelector((state) => state.property);

  const renderProperties = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-2 shadow-md flex-row justify-between items-center">
      <View>
        <Text className="text-gray-800 font-semibold">{item.name}</Text>
        <Text className="text-gray-600">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="bg-[#09092B] w-full min-h-screen">
      <Text onPress={() => console.log(properties)}>Listing</Text>
      {properties?.length > 0 ? (
        <View>
          <Text>Active Listing</Text>
          <FlatList
            data={properties}
            keyExtractor={(item) => item._id}
            renderItem={renderProperties}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <Text>No listing posted</Text>
      )}
    </View>
  );
};

export default Listing;
