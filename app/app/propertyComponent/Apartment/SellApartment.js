import { View } from "react-native";
import React from "react";
import FormField from "../../../components/FormField";

const SellApartment = ({ formData, setFormData }) => {
  return (
    <View>
      <FormField
        title="Title"
        value={formData.title}
        handleChangeText={(e) => setFormData({ ...formData, title: e })}
        otherStyles="mt-6"
      />
      <FormField
        title="Number of Rooms"
        value={formData.numberOfRooms}
        placeholder="number of rooms"
        handleChangeText={(e) =>
          setFormData({ ...formData, numberOfRooms: parseInt(e) })
        }
        otherStyles="mt-6"
        keyboardType="numeric"
      />
      <FormField
        title="Location"
        value={formData.location}
        handleChangeText={(e) => setFormData({ ...formData, location: e })}
        otherStyles="mt-6"
      />
      <FormField
        title="Price"
        value={formData.price}
        handleChangeText={(e) =>
          setFormData({ ...formData, price: parseFloat(e) })
        }
        otherStyles="mt-6"
        keyboardType="numeric"
      />
      <FormField
        title="Description"
        value={formData.description}
        handleChangeText={(e) => setFormData({ ...formData, description: e })}
        otherStyles="mt-6"
      />
    </View>
  );
};

export default SellApartment;
