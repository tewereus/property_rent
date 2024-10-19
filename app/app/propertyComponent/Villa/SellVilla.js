import { View, Text } from "react-native";
import React from "react";

const SellVilla = () => {
  return (
    <View>
      <FormField
        title="Name"
        value={form.name}
        handleChangeText={(e) => setForm({ ...form, name: e })}
        otherStyles="mt-6"
      />
      <FormField
        title="Bedrooms"
        value={form.num_bed.toString()}
        placeholder="Number of bedrooms"
        handleChangeText={(e) => setForm({ ...form, num_bed: parseInt(e) })}
        otherStyles="mt-6"
        keyboardType="numeric"
      />
      <FormField
        title="Location"
        value={form.location}
        handleChangeText={(e) => setForm({ ...form, location: e })}
        otherStyles="mt-6"
      />
      <FormField
        title="Price"
        value={form.price.toString()}
        handleChangeText={(e) => setForm({ ...form, price: parseFloat(e) })}
        otherStyles="mt-6"
        keyboardType="numeric"
      />
      <FormField
        title="Description"
        value={form.description}
        handleChangeText={(e) => setForm({ ...form, description: e })}
        otherStyles="mt-6"
      />
    </View>
  );
};

export default SellVilla;
