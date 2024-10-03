import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPropertyTypes } from "../../store/propertyType/propertyTypeSlice";
import CustomButton from "../../components/CustomButton";

const Create = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllPropertyTypes());
  }, []);

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

  const handleNext = () => {
    router.push({
      pathname: "/create_property",
      params: { type: selectPropertyId, action: selectPropertyUse },
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

      <CustomButton
        title="Continue"
        handlePress={handleNext}
        containerStyles="mt-7"
      />
    </View>
  );
};

export default Create;
