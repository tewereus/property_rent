// app/app/create_property.js
import { View, Text, ScrollView, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createProperty,
  resetAuthState,
} from "../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import MapComponent from "../components/MapComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import SellVilla from "./propertyComponent/Villa/SellVilla";
import RentVilla from "./propertyComponent/Villa/RentVilla";
import SellApartment from "./propertyComponent/Apartment/SellApartment";
import RentApartment from "./propertyComponent/Apartment/RentApartment";
import SellWarehouse from "./propertyComponent/Warehouse/SellWarehouse";
import RentWarehouse from "./propertyComponent/Warehouse/RentWarehouse";
import SellCar from "./propertyComponent/Car/SellCar";
import RentCar from "./propertyComponent/Car/RentCar";
// import SellHall from "./propertyComponent/Hall/SellHall";
import RentHall from "./propertyComponent/Hall/RentHall";

const CreateProperty = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type, action } = useLocalSearchParams();

  // Initialize formData with only relevant fields for the selected property type
  const initialFormData = {
    title: "",
    location: "",
    price: 0,
    description: "",
    ...(type === "villa" && { num_bed: 0, gardenSize: "" }),
    ...(type === "apartment" && { numberOfRooms: 0 }),
    ...(type === "warehouse" && { storageCapacity: 0 }),
    ...(type === "car" && { makeModel: "" }),
    ...(type === "hall" && { capacity: 0 }),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showMapModal, setShowMapModal] = useState(false);
  const { isSuccess, isError, message } = useSelector(
    (state) => state.property
  );

  const handleLocationSelect = (coords) => {
    const locationString = `${coords.latitude}, ${coords.longitude}`;
    setFormData({ ...formData, location: locationString });
    setShowMapModal(false);
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      propertyType: type,
      property_use: action,
    };

    dispatch(createProperty(data));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-gray-300 dark:bg-[#09092B] w-full p-5">
        <Text className="text-xl font-bold dark:text-slate-300 mb-4">
          Create Property
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {type === "villa" &&
            (action === "sell" ? (
              <SellVilla formData={formData} setFormData={setFormData} />
            ) : (
              <RentVilla formData={formData} setFormData={setFormData} />
            ))}
          {type === "apartment" &&
            (action === "sell" ? (
              <SellApartment formData={formData} setFormData={setFormData} />
            ) : (
              <RentApartment formData={formData} setFormData={setFormData} />
            ))}
          {type === "warehouse" &&
            (action === "sell" ? (
              <SellWarehouse formData={formData} setFormData={setFormData} />
            ) : (
              <RentWarehouse formData={formData} setFormData={setFormData} />
            ))}
          {type === "car" &&
            (action === "sell" ? (
              <SellCar formData={formData} setFormData={setFormData} />
            ) : (
              <RentCar formData={formData} setFormData={setFormData} />
            ))}
          {type === "hall" && action === "rent" && (
            <RentHall formData={formData} setFormData={setFormData} />
          )}

          <CustomButton
            title="Select Location on Map"
            handlePress={() => setShowMapModal(true)}
            containerStyles="mt-7 mb-5"
          />

          <CustomButton
            title="Add Property"
            handlePress={handleSubmit}
            containerStyles="mt-7 mb-5"
          />
        </ScrollView>

        <Modal
          visible={showMapModal}
          animationType="slide"
          onRequestClose={() => setShowMapModal(false)}
        >
          <View style={{ flex: 1 }}>
            <MapComponent onLocationSelect={handleLocationSelect} />
            <CustomButton
              title="Close Map"
              handlePress={() => setShowMapModal(false)}
              containerStyles={{ marginBottom: 20 }}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default CreateProperty;
