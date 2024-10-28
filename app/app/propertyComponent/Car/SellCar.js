// app/app/propertyComponent/Car/SellCar.js
import { View } from "react-native";
import React from "react";
import FormField from "../../../components/FormField";

const SellCar = ({ formData, setFormData }) => {
  return (
    <View>
      <FormField
        title="Make and Model"
        value={formData.makeModel}
        handleChangeText={(e) => setFormData({ ...formData, makeModel: e })}
        otherStyles="mt-6"
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

export default SellCar;
