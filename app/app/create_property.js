// import { View, Text, ScrollView, Modal } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   createProperty,
//   resetAuthState,
// } from "../store/property/propertySlice";
// import { useDispatch, useSelector } from "react-redux";
// import FormField from "../components/FormField";
// import CustomButton from "../components/CustomButton";
// import MapComponent from "../components/MapComponent"; // Import the MapComponent
// import { SafeAreaView } from "react-native-safe-area-context";

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

//   const [showMapModal, setShowMapModal] = useState(false); // State for map modal visibility
//   const { isSuccess, isError, message } = useSelector(
//     (state) => state.property
//   );

//   const handleLocationSelect = (coords) => {
//     // Update form location with selected coordinates
//     setForm({ ...form, location: `${coords.latitude}, ${coords.longitude}` });
//     setShowMapModal(false); // Hide the modal after selection
//   };

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
//       console.log("Success:", message);
//       if (message === "Property Added Successfully") {
//         dispatch(resetAuthState());
//         router.push("/seller_tabs/listing");
//       }
//     }

//     if (isError) {
//       console.error("Error:", message);
//     }
//   }, [isSuccess, isError, message]);

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View className="bg-gray-300 dark:bg-[#09092B] w-full p-5">
//         <Text className="text-xl font-bold dark:text-slate-300 mb-4">
//           Create Property
//         </Text>

//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 20 }}
//         >
//           {type === "villa" && (
//             <View>
//               <FormField
//                 title="Name"
//                 value={form.name}
//                 handleChangeText={(e) => setForm({ ...form, name: e })}
//                 otherStyles="mt-6"
//               />
//               <FormField
//                 title="Bedrooms"
//                 value={form.num_bed.toString()}
//                 placeholder="Number of bedrooms"
//                 handleChangeText={(e) =>
//                   setForm({ ...form, num_bed: parseInt(e) })
//                 }
//                 otherStyles="mt-6"
//                 keyboardType="numeric"
//               />
//               <FormField
//                 title="Location"
//                 value={form.location}
//                 handleChangeText={(e) => setForm({ ...form, location: e })}
//                 otherStyles="mt-6"
//               />
//               <FormField
//                 title="Price"
//                 value={form.price.toString()}
//                 handleChangeText={(e) =>
//                   setForm({ ...form, price: parseFloat(e) })
//                 }
//                 otherStyles="mt-6"
//                 keyboardType="numeric"
//               />
//               <FormField
//                 title="Description"
//                 value={form.description}
//                 handleChangeText={(e) => setForm({ ...form, description: e })}
//                 otherStyles="mt-6"
//               />
//             </View>
//           )}

//           {/* Button to show Map Modal */}
//           <CustomButton
//             title="Select Location on Map"
//             handlePress={() => setShowMapModal(true)}
//             containerStyles="mt-7 mb-5"
//           />

//           {/* Fixed button at the bottom */}
//           <CustomButton
//             title="Add Property"
//             handlePress={handleSubmit}
//             containerStyles="mt-7 mb-5" // Add margin at the bottom for spacing
//           />
//         </ScrollView>

//         {/* Modal for Map Component */}
//         <Modal
//           visible={showMapModal}
//           animationType="slide"
//           onRequestClose={() => setShowMapModal(false)} // Close modal on back press
//         >
//           <View style={{ flex: 1 }}>
//             <MapComponent onLocationSelect={handleLocationSelect} />
//             <CustomButton
//               title="Close Map"
//               handlePress={() => setShowMapModal(false)}
//               containerStyles={{ marginBottom: 20 }} // Add some margin for spacing
//             />
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default CreateProperty;

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
import MapComponent from "../components/MapComponent"; // Import the MapComponent
import { SafeAreaView } from "react-native-safe-area-context";
import SellVilla from "./propertyComponent/Villa/SellVilla";
import SellApartment from "./propertyComponent/Apartment/SellApartment";
import RentApartment from "./propertyComponent/Apartment/RentApartment";
import RentVilla from "./propertyComponent/Villa/RentVilla";

const CreateProperty = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { type, action } = useLocalSearchParams();
  const [villaForm, setVillaForm] = useState({
    name: "",
    num_bed: 0,
    location: "",
    price: 0,
    description: "",
  });

  const [apartmentForm, setApartmentForm] = useState({
    name: "",
    floor: 0,
  });

  const [showMapModal, setShowMapModal] = useState(false); // State for map modal visibility
  const { isSuccess, isError, message } = useSelector(
    (state) => state.property
  );

  const handleLocationSelect = (coords) => {
    const locationString = `${coords.latitude}, ${coords.longitude}`;

    if (type === "villa") {
      setVillaForm({ ...villaForm, location: locationString });
    } else if (type === "apartment") {
      setApartmentForm({ ...apartmentForm, location: locationString });
    }

    setShowMapModal(false);
  };

  const handleSubmit = () => {
    const data = type === "villa" ? villaForm : apartmentForm;

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
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {type === "villa" &&
            (action === "sell" ? (
              <SellVilla formData={villaForm} setFormData={setVillaForm} />
            ) : (
              <RentVilla formData={villaForm} setFormData={setVillaForm} />
            ))}
          {type === "apartment" &&
            (action === "sell" ? (
              <SellApartment
                formData={apartmentForm}
                setFormData={setApartmentForm}
              />
            ) : (
              <RentApartment
                formData={apartmentForm}
                setFormData={setApartmentForm}
              />
            ))}

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
              containerStyles={{ marginBottom: 20 }} // Add some margin for spacing
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default CreateProperty;
