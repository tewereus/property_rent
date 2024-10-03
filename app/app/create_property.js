import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createProperty,
  resetAuthState,
} from "../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";

const create_property = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type, action } = useLocalSearchParams();
  const [form, setForm] = useState({
    name: "",
    property_type: "",
    property_use: "",
    num_bed: 0,
    location: "",
    price: 0,
    description: "",
  });
  const handlePress = () => {
    console.log("type: ", type);
    console.log("action: ", action);
  };

  const { isSuccess, isError, message } = useSelector(
    (state) => state.property
  );

  const handleSubmit = () => {
    const data = {
      name: form.name,
      property_type: type,
      property_use: action,
      num_bed: form.num_bed,
      location: form.location,
      price: form.price,
      description: form.description,
    };
    // console.log("data: ", data);
    dispatch(createProperty(data));
  };

  useEffect(() => {
    console.log("success: ", isSuccess);
    if (message === "property added successfully") {
      dispatch(resetAuthState());
      router.push("/seller_tabs/listing");
    }
  }, [isSuccess, isError]);

  return (
    <View>
      <Text onPress={handlePress}>create_property</Text>
      {type === "villa" &&
        (action === "sell" ? (
          <View>
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
            <CustomButton
              title="Add Property"
              handlePress={handleSubmit}
              containerStyles="mt-7"
            />
          </View>
        ) : (
          <Text>Rent villa</Text>
        ))}
      {type === "car" &&
        (action === "sell" ? <Text>Sell car</Text> : <Text>Rent car</Text>)}
    </View>
  );
};

export default create_property;
