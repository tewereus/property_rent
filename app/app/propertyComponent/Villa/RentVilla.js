import { View } from "react-native";
import React from "react";
import FormField from "../../../components/FormField";

const RentVilla = ({ formData, setFormData }) => {
  return (
    <View>
      <FormField
        title="Title"
        value={formData.title}
        handleChangeText={(e) => setFormData({ ...formData, title: e })}
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
      <FormField
        title="Garden Size"
        value={formData.gardenSize}
        handleChangeText={(e) => setFormData({ ...formData, gardenSize: e })}
        otherStyles="mt-6"
        keyboardType="numeric"
      />
    </View>
  );
};

export default RentVilla;
