import { View, Text } from "react-native";
import React, { useState } from "react";
import FormField from "../../components/FormField";

const Create = () => {
  const [form, setForm] = useState({
    name: "",
    property_type: "",
    property_use: "",
    num_bed: 0,
    location: "",
    price: 0,
    description: "",
  });
  return (
    <View className={`bg-gray-300 dark:bg-[#09092B] w-full min-h-screen`}>
      <Text className="dark:text-slate-300">Create</Text>
      <Text className="dark:text-slate-300">
        <FormField
          title="name"
          value={form.name}
          handleChangeText={(e) => setForm({ ...form, name: e })}
          otherStyles="mt-6"
        />
        <FormField
          title="bedrooms"
          value={form.num_bed}
          placeholder="Number of bedrooms"
          handleChangeText={(e) => setForm({ ...form, num_bed: e })}
          otherStyles="mt-6"
        />
        <FormField
          title="location"
          value={form.location}
          handleChangeText={(e) => setForm({ ...form, location: e })}
          otherStyles="mt-6"
        />
        <FormField
          title="price"
          value={form.price}
          handleChangeText={(e) => setForm({ ...form, price: e })}
          otherStyles="mt-6"
        />
        <FormField
          title="description"
          value={form.description}
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-6"
        />
      </Text>
    </View>
  );
};

export default Create;
