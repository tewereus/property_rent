import { View, Text, TextInput, ScrollView } from "react-native";
import React from "react";
import CustomButton from "../../../components/CustomButton";

const RentApartment = ({ formData, setFormData }) => {
  return (
    <ScrollView className="p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5 text-gray-800">
        Rent an Apartment
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        placeholder="Apartment Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        placeholder="Floor Number"
        keyboardType="numeric"
        value={formData.floor}
        onChangeText={(text) =>
          setFormData({ ...formData, floor: parseInt(text) })
        }
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        placeholder="Price"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(text) =>
          setFormData({ ...formData, price: parseFloat(text) })
        }
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />

      <CustomButton
        title="Submit"
        handlePress={() => console.log("Apartment data submitted")}
        containerStyles="mt-5 bg-blue-500"
      />
    </ScrollView>
  );
};

export default RentApartment;
