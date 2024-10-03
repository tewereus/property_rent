import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPropertyTypes } from "../../store/propertyType/propertyTypeSlice";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { createProperty } from "../../store/property/propertySlice";

const Create = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllPropertyTypes());
  }, []);

  const [form, setForm] = useState({
    name: "",
    property_type: "",
    property_use: "",
    num_bed: 0,
    location: "",
    price: 0,
    description: "",
  });
  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
  const [selectPropertyId, setSelectedPropertyId] = useState("");
  const [selectPropertyUse, setSelectedPropertyUse] = useState("");
  const [propertyUseVisible, setPropertyUseVisible] = useState("");

  const usePropertyData = ["rent", "sell"];

  const { propertyTypes } = useSelector((state) => state.propertyType);

  const handlePropertyTypeSelect = (type) => {
    setSelectedPropertyId(type);
    setPropertyTypeVisible(false);
  };

  const handlePropertyUseSelect = (use) => {
    setSelectedPropertyUse(use);
    setPropertyUseVisible(false);
  };

  const handleSubmit = () => {
    const data = {
      name: form.name,
      property_type: selectPropertyId,
      property_use: selectPropertyUse,
      num_bed: form.num_bed,
      location: form.location,
      price: form.price,
      description: form.description,
    };
    // console.log("data: ", data);
    dispatch(createProperty(data));
  };

  const handleNext = () => {
    router.push({
      pathname: "/create_property",
      params: { propertyType: "villa", action: "sell" },
    });
  };

  return (
    <View className={`bg-gray-300 dark:bg-[#09092B] w-full min-h-screen`}>
      <Text
        className="text-slate-800"
        onPress={() => console.log("property types: ", propertyTypes)}
      >
        Create
      </Text>

      <TouchableOpacity
        onPress={() => setPropertyTypeVisible(true)}
        className="bg-gray-200 p-2 rounded mb-3"
      >
        <Text>{selectPropertyId ? selectPropertyId : "Select Company"}</Text>
      </TouchableOpacity>
      {propertyTypeVisible && (
        <View className="absolute bg-white rounded-lg shadow-lg z-10 w-full">
          <FlatList
            data={propertyTypes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePropertyTypeSelect(item)}
                className="p-2 border-b border-gray-200"
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        // <Text>Hello</Text>
      )}

      <TouchableOpacity
        onPress={() => setPropertyUseVisible(true)}
        className="bg-gray-200 p-2 rounded mb-3"
      >
        <Text>
          {selectPropertyUse ? selectPropertyUse : "Select property use"}
        </Text>
      </TouchableOpacity>
      {propertyUseVisible && (
        <View className="absolute bg-white rounded-lg shadow-lg z-10 w-full">
          <FlatList
            data={usePropertyData}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePropertyUseSelect(item)}
                className="p-2 border-b border-gray-200"
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        // <Text>Hello</Text>
      )}

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

      <CustomButton
        title="Continue"
        handlePress={handleNext}
        containerStyles="mt-7"
      />
    </View>
  );
};

export default Create;
