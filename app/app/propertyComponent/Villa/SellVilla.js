import { View, Text } from "react-native";
import React from "react";
import FormField from "../../../components/FormField";

const SellVilla = ({ formData, setFormData }) => {
  return (
    <View>
      <FormField
        title="Name"
        value={formData.name}
        handleChangeText={(e) => setFormData({ ...formData, name: e })}
        otherStyles="mt-6"
      />
      <FormField
        title="Bedrooms"
        value={formData.num_bed.toString()}
        placeholder="Number of bedrooms"
        handleChangeText={(e) =>
          setFormData({ ...formData, num_bed: parseInt(e) })
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
        value={formData.price.toString()}
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

export default SellVilla;
