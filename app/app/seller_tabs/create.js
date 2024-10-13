// import { View, Text, TouchableOpacity, FlatList } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllPropertyTypes } from "../../store/propertyType/propertyTypeSlice";
// import CustomButton from "../../components/CustomButton";

// const Create = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getAllPropertyTypes());
//   }, []);

//   const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
//   const [selectPropertyId, setSelectedPropertyId] = useState("");
//   const [selectPropertyUse, setSelectedPropertyUse] = useState("");
//   const [propertyUseVisible, setPropertyUseVisible] = useState("");

//   const usePropertyData = ["rent", "sell"];

//   const { propertyTypes } = useSelector((state) => state.propertyType);

//   const handlePropertyTypeSelect = (type) => {
//     setSelectedPropertyId(type);
//     setPropertyTypeVisible(false);
//   };

//   const handlePropertyUseSelect = (use) => {
//     setSelectedPropertyUse(use);
//     setPropertyUseVisible(false);
//   };

//   const handleNext = () => {
//     router.push({
//       pathname: "/create_property",
//       params: { type: selectPropertyId, action: selectPropertyUse },
//     });
//   };

//   return (
//     <View className={`bg-gray-300 dark:bg-[#09092B] w-full min-h-screen`}>
//       <Text
//         className="text-slate-800"
//         onPress={() => console.log("property types: ", propertyTypes)}
//       >
//         Create
//       </Text>

//       <TouchableOpacity
//         onPress={() => setPropertyTypeVisible(true)}
//         className="bg-gray-200 p-2 rounded mb-3"
//       >
//         <Text>{selectPropertyId ? selectPropertyId : "Select Company"}</Text>
//       </TouchableOpacity>
//       {propertyTypeVisible && (
//         <View className="absolute bg-white rounded-lg shadow-lg z-10 w-full">
//           <FlatList
//             data={propertyTypes}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => handlePropertyTypeSelect(item)}
//                 className="p-2 border-b border-gray-200"
//               >
//                 <Text>{item}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//         // <Text>Hello</Text>
//       )}

//       <TouchableOpacity
//         onPress={() => setPropertyUseVisible(true)}
//         className="bg-gray-200 p-2 rounded mb-3"
//       >
//         <Text>
//           {selectPropertyUse ? selectPropertyUse : "Select property use"}
//         </Text>
//       </TouchableOpacity>
//       {propertyUseVisible && (
//         <View className="absolute bg-white rounded-lg shadow-lg z-10 w-full">
//           <FlatList
//             data={usePropertyData}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => handlePropertyUseSelect(item)}
//                 className="p-2 border-b border-gray-200"
//               >
//                 <Text>{item}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//         // <Text>Hello</Text>
//       )}

//       <CustomButton
//         title="Continue"
//         handlePress={handleNext}
//         containerStyles="mt-7"
//       />
//     </View>
//   );
// };

// export default Create;

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
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
  }, [dispatch]);

  const [propertyTypeVisible, setPropertyTypeVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedPropertyUse, setSelectedPropertyUse] = useState("");
  const [propertyUseVisible, setPropertyUseVisible] = useState(false);

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
      params: { type: selectedPropertyId, action: selectedPropertyUse },
    });
  };

  // Close dropdowns when clicking outside
  const handleOutsidePress = () => {
    if (propertyTypeVisible) setPropertyTypeVisible(false);
    if (propertyUseVisible) setPropertyUseVisible(false);
  };

  return (
    <Pressable onPress={handleOutsidePress} className="flex-1">
      <View className="bg-gray-300 dark:bg-[#09092B] w-full min-h-screen flex justify-center items-center p-5">
        <Text className="text-xl font-bold dark:text-slate-300 mb-4">
          Create
        </Text>

        {/* Property Type Selector */}
        <TouchableOpacity
          onPress={() => setPropertyTypeVisible(true)}
          className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg mb-3 w-full max-w-md shadow"
        >
          <Text className="text-gray-700 dark:text-white text-lg">
            {selectedPropertyId || "Select Property Type"}
          </Text>
        </TouchableOpacity>

        {/* Property Type Dropdown */}
        {propertyTypeVisible && (
          <View className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-full max-w-md">
            <FlatList
              data={propertyTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handlePropertyTypeSelect(item)}
                  className="p-5 border-b border-gray-200 dark:border-gray-600"
                >
                  <Text className="text-gray-600 dark:text-white font-semibold text-lg">
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-200 dark:bg-gray-600" />
              )}
            />
          </View>
        )}

        {/* Property Use Selector */}
        <TouchableOpacity
          onPress={() => setPropertyUseVisible(true)}
          className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg mb-3 w-full max-w-md shadow"
        >
          <Text className="text-gray-700 dark:text-white text-lg">
            {selectedPropertyUse || "Select Property Use"}
          </Text>
        </TouchableOpacity>

        {/* Property Use Dropdown */}
        {propertyUseVisible && (
          <View className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-full max-w-md">
            <FlatList
              data={usePropertyData}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handlePropertyUseSelect(item)}
                  className="p-5 border-b border-gray-200 dark:border-gray-600"
                >
                  <Text className="text-gray-600 dark:text-white font-semibold text-lg">
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-200 dark:bg-gray-600" />
              )}
            />
          </View>
        )}

        {/* Continue Button */}
        <CustomButton
          title="Continue"
          handlePress={handleNext}
          containerStyles="mt-7"
        />
      </View>
    </Pressable>
  );
};

export default Create;
