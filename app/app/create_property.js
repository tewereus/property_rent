// import { View, Text } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   createProperty,
//   resetAuthState,
// } from "../store/property/propertySlice";
// import { useDispatch, useSelector } from "react-redux";
// import FormField from "../components/FormField";
// import CustomButton from "../components/CustomButton";

// const create_property = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { type, action } = useLocalSearchParams();
//   const [form, setForm] = useState({
//     name: "",
//     property_type: "",
//     property_use: "",
//     num_bed: 0,
//     location: "",
//     price: 0,
//     description: "",
//   });
//   const handlePress = () => {
//     console.log("type: ", type);
//     console.log("action: ", action);
//   };

//   const { isSuccess, isError, message } = useSelector(
//     (state) => state.property
//   );

//   const handleSubmit = () => {
//     const data = {
//       name: form.name,
//       property_type: type,
//       property_use: action,
//       num_bed: form.num_bed,
//       location: form.location,
//       price: form.price,
//       description: form.description,
//     };
//     // console.log("data: ", data);
//     dispatch(createProperty(data));
//   };

//   useEffect(() => {
//     console.log("success: ", isSuccess);
//     if (message === "Property Added Successfully") {
//       dispatch(resetAuthState());
//       router.push("/seller_tabs/listing");
//     }
//   }, [isSuccess, isError]);

//   return (
//     <View>
//       <Text onPress={handlePress}>create_property</Text>
//       {type === "villa" &&
//         (action === "sell" ? (
//           <View>
//             <FormField
//               title="name"
//               value={form.name}
//               handleChangeText={(e) => setForm({ ...form, name: e })}
//               otherStyles="mt-6"
//             />
//             <FormField
//               title="bedrooms"
//               value={form.num_bed}
//               placeholder="Number of bedrooms"
//               handleChangeText={(e) => setForm({ ...form, num_bed: e })}
//               otherStyles="mt-6"
//             />
//             <FormField
//               title="location"
//               value={form.location}
//               handleChangeText={(e) => setForm({ ...form, location: e })}
//               otherStyles="mt-6"
//             />
//             <FormField
//               title="price"
//               value={form.price}
//               handleChangeText={(e) => setForm({ ...form, price: e })}
//               otherStyles="mt-6"
//             />
//             <FormField
//               title="description"
//               value={form.description}
//               handleChangeText={(e) => setForm({ ...form, description: e })}
//               otherStyles="mt-6"
//             />
//             <CustomButton
//               title="Add Property"
//               handlePress={handleSubmit}
//               containerStyles="mt-7"
//             />
//           </View>
//         ) : (
//           <Text>Rent villa</Text>
//         ))}
//       {type === "car" &&
//         (action === "sell" ? <Text>Sell car</Text> : <Text>Rent car</Text>)}
//     </View>
//   );
// };

// export default create_property;

// import { View, Text, ScrollView } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   createProperty,
//   resetAuthState,
// } from "../store/property/propertySlice";
// import { useDispatch, useSelector } from "react-redux";
// import FormField from "../components/FormField";
// import CustomButton from "../components/CustomButton";

// const CreateProperty = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { type, action } = useLocalSearchParams();

//   const [form, setForm] = useState({
//     name: "",
//     property_type: "",
//     property_use: "",
//     num_bed: 0,
//     location: "",
//     price: 0,
//     description: "",
//   });

//   const { isSuccess, isError, message } = useSelector(
//     (state) => state.property
//   );

//   const handleSubmit = () => {
//     const data = {
//       name: form.name,
//       property_type: type,
//       property_use: action,
//       num_bed: form.num_bed,
//       location: form.location,
//       price: form.price,
//       description: form.description,
//     };
//     dispatch(createProperty(data));
//   };

//   useEffect(() => {
//     if (isSuccess) {
//       console.log("Success:", message); // Debugging log
//       if (message === "Property Added Successfully") {
//         dispatch(resetAuthState());
//         router.push("/seller_tabs/listing");
//       }
//     }

//     if (isError) {
//       console.error("Error:", message); // Debugging log for error
//     }
//   }, [isSuccess, isError, message]); // Add message to dependencies

//   return (
//     <View className="bg-gray-300 dark:bg-[#09092B] w-full min-h-screen p-5">
//       <Text className="text-xl font-bold dark:text-slate-300 mb-4">
//         Create Property
//       </Text>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       >
//         {type === "villa" && (
//           <View>
//             <FormField
//               title="Name"
//               value={form.name}
//               handleChangeText={(e) => setForm({ ...form, name: e })}
//               otherStyles="mt-6"
//             />
//             <FormField
//               title="Bedrooms"
//               value={form.num_bed.toString()} // Ensure this is a string for the input
//               placeholder="Number of bedrooms"
//               handleChangeText={(e) =>
//                 setForm({ ...form, num_bed: parseInt(e) })
//               }
//               otherStyles="mt-6"
//               keyboardType="numeric" // Numeric keyboard for bedrooms
//             />
//             <FormField
//               title="Location"
//               value={form.location}
//               handleChangeText={(e) => setForm({ ...form, location: e })}
//               otherStyles="mt-6"
//             />
//             <FormField
//               title="Price"
//               value={form.price.toString()} // Ensure this is a string for the input
//               handleChangeText={(e) =>
//                 setForm({ ...form, price: parseFloat(e) })
//               }
//               otherStyles="mt-6"
//               keyboardType="numeric" // Numeric keyboard for price
//             />
//             <FormField
//               title="Description"
//               value={form.description}
//               handleChangeText={(e) => setForm({ ...form, description: e })}
//               otherStyles="mt-6"
//             />
//           </View>
//         )}
//         {type === "car" && (
//           <Text className="dark:text-white mt-4">
//             {action === "sell" ? "Sell Car" : "Rent Car"}
//           </Text>
//         )}
//       </ScrollView>

//       {/* Fixed button at the bottom */}
//       <CustomButton
//         title="Add Property"
//         handlePress={handleSubmit}
//         containerStyles="mt-7 mb-5" // Add margin at the bottom for spacing
//       />
//     </View>
//   );
// };

// export default CreateProperty;

import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createProperty,
  resetAuthState,
} from "../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import MapComponent from "../components/MapComponent"; // Import the MapComponent
import { SafeAreaView } from "react-native-safe-area-context";

const CreateProperty = () => {
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

  const [showMap, setShowMap] = useState(false); // State for map visibility
  const { isSuccess, isError, message } = useSelector(
    (state) => state.property
  );

  const handleLocationSelect = (coords) => {
    // Update form location with selected coordinates
    setForm({ ...form, location: `${coords.latitude}, ${coords.longitude}` });
    setShowMap(false); // Hide the map after selection
  };

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
    dispatch(createProperty(data));
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Success:", message);
      if (message === "Property Added Successfully") {
        dispatch(resetAuthState());
        router.push("/seller_tabs/listing");
      }
    }

    if (isError) {
      console.error("Error:", message);
    }
  }, [isSuccess, isError, message]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-gray-300 dark:bg-[#09092B] w-full p-5">
        <Text className="text-xl font-bold dark:text-slate-300 mb-4">
          Create Property
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {type === "villa" && (
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
                handleChangeText={(e) =>
                  setForm({ ...form, num_bed: parseInt(e) })
                }
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
                handleChangeText={(e) =>
                  setForm({ ...form, price: parseFloat(e) })
                }
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
          )}

          {/* Button to show Map Component */}
          <CustomButton
            title="Select Location on Map"
            handlePress={() => setShowMap(!showMap)}
            containerStyles="mt-7 mb-5"
          />

          {/* Render Map Component conditionally */}
          {showMap && (
            <View style={{ height: "40%", marginTop: 20 }}>
              <MapComponent onLocationSelect={handleLocationSelect} />
            </View>
          )}

          {/* Ensure button is visible at the bottom */}
          <CustomButton
            title="Add Property"
            handlePress={handleSubmit}
            containerStyles="mt-7 mb-5" // Add margin at the bottom for spacing
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateProperty;
