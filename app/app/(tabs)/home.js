// import {
//   View,
//   Text,
//   Switch,
//   FlatList,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useColorScheme } from "nativewind";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllProperties,
//   getAllRentProperties,
//   getAllSellProperties,
// } from "../../store/property/propertySlice";

// import { addToWishlist } from "../../store/auth/authSlice";

// const Home = () => {
//   const dispatch = useDispatch();
//   const { colorScheme, setColorScheme } = useColorScheme();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [favouriteOn, setFavouriteOn] = useState(false); // by default should be, on if it is on users wishlist and off if not

//   const loadColorScheme = async () => {
//     try {
//       const userData = JSON.parse(await AsyncStorage.getItem("user"));
//       if (userData && userData.preference) {
//         const storedMode = userData.preference.mode;
//         setColorScheme(storedMode);
//       }
//     } catch (error) {
//       console.error("Failed to load user data:", error);
//     }
//   };

//   useEffect(() => {
//     loadColorScheme();
//     dispatch(getAllSellProperties());
//     dispatch(getAllRentProperties());
//   }, []);

//   const { sellProperties, rentProperties } = useSelector(
//     (state) => state.property
//   );

//   const handleSellPress = (prop) => {
//     setSelectedProperty(prop);
//     setModalVisible(true);
//   };

//   const handleFavourite = () => {
//     const data = {
//       prodId: selectedProperty?._id,
//     };
//     dispatch(addToWishlist(data));
//     setFavouriteOn(!favouriteOn);
//   };

//   const renderSellProperties = ({ item }) => (
//     <TouchableOpacity onPress={() => handleSellPress(item)}>
//       <View>
//         <Text>{item.name}</Text>
//         <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderRentProperties = ({ item }) => (
//     <TouchableOpacity onPress={() => handleSellPress(item)}>
//       <View>
//         <Text>{item.name}</Text>
//         <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
//       <Text
//         className="text-lg dark:text-slate-300"
//         onPress={() => console.log(rentProperties)}
//       >
//         Home
//       </Text>
//       {sellProperties?.length > 0 || rentProperties?.length > 0 ? (
//         <View>
//           <Text
//             onPress={() => console.log(sellProperties)}
//             className="dark:text-white"
//           >
//             Available for Sell
//           </Text>
//           <FlatList
//             data={sellProperties}
//             keyExtractor={(item) => item._id}
//             renderItem={renderSellProperties}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />

//           <Text onPress={() => console.log(rentProperties)}>
//             Available for Rent
//           </Text>
//           <FlatList
//             data={rentProperties}
//             keyExtractor={(item) => item._id}
//             renderItem={renderRentProperties}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />
//           <Modal
//             animationType="none"
//             transparent={false}
//             visible={modalVisible}
//             onRequestClose={() => {
//               setModalVisible(!modalVisible);
//             }}
//           >
//             <View className="flex-1 justify-end bg-black bg-opacity-50">
//               <View className="w-full bg-white rounded-t-lg p-5">
//                 <Text
//                   className="text-center"
//                   onPress={() => console.log(selectedProperty)}
//                 >
//                   View Property
//                 </Text>
//                 {/* <FlatList
//                   data={images}
//                   keyExtractor={(item)=> item}
//                   renderItem={}
//                 /> */}
//                 <View
//                   style={{
//                     backgroundColor: "red",
//                     height: "20vh",
//                     width: "45vh",
//                     justifyContent: "center",
//                     alignSelf: "center",
//                   }}
//                 >
//                   <Text className="text-center">Image here</Text>
//                   <Text
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       right: 0,
//                       color: favouriteOn ? "white" : "black",
//                     }}
//                     onPress={handleFavourite}
//                   >
//                     Favourite
//                   </Text>
//                   {/* <Image
//                   source={icons.star}
//                   className="max-w-[380px] w-full h-[298px]"
//                   resizeMode="contain"
//                 /> */}
//                 </View>
//                 <Text className="text-center">{selectedProperty?.name}</Text>
//                 <Text className="text-center">
//                   {selectedProperty?.location}
//                 </Text>
//                 <Text className="text-center">{selectedProperty?.price}</Text>
//                 <Text className="text-center">Description</Text>
//                 <Text className="text-center">
//                   {selectedProperty?.description}
//                 </Text>

//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   className="bg-red-500 p-2 rounded"
//                 >
//                   <Text className="text-white text-center">Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       ) : (
//         <Text>No properties listed</Text>
//       )}

//       {/* <SliderBox
//         images={images}
//         sliderBoxHeight={200}
//         onCurrentImagePressed={(index) => console.warn(`image ${index} pressed`)}
//         dotColor="#FFEE58"
//         inactiveDotColor="#90A4AE"
//         paginationBoxStyle={{
//           position: 'absolute',
//           bottom: 10,
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: 0,
//           margin: 0,
//         }}
//       /> */}
//     </View>
//   );
// };

// export default Home;

// import {
//   View,
//   Text,
//   Switch,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   Image,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useColorScheme } from "nativewind";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllProperties,
//   getAllRentProperties,
//   getAllSellProperties,
// } from "../../store/property/propertySlice";
// import { addToWishlist } from "../../store/auth/authSlice";

// const Home = () => {
//   const dispatch = useDispatch();
//   const { colorScheme, setColorScheme } = useColorScheme();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [favouriteOn, setFavouriteOn] = useState(false);

//   const loadColorScheme = async () => {
//     try {
//       const userData = JSON.parse(await AsyncStorage.getItem("user"));
//       if (userData && userData.preference) {
//         const storedMode = userData.preference.mode;
//         setColorScheme(storedMode);
//       }
//     } catch (error) {
//       console.error("Failed to load user data:", error);
//     }
//   };

//   useEffect(() => {
//     loadColorScheme();
//     dispatch(getAllSellProperties());
//     dispatch(getAllRentProperties());
//   }, []);

//   const { sellProperties, rentProperties } = useSelector(
//     (state) => state.property
//   );

//   const handlePress = (prop) => {
//     setSelectedProperty(prop);
//     setFavouriteOn(prop.isFavorite); // Assuming prop contains isFavorite
//     setModalVisible(true);
//   };

//   const handleFavourite = () => {
//     const data = {
//       prodId: selectedProperty?._id,
//     };
//     dispatch(addToWishlist(data));
//     setFavouriteOn(!favouriteOn);
//   };

//   const renderPropertyItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => handlePress(item)}
//       className="bg-white rounded-lg shadow-md p-4 m-2"
//     >
//       <Text className="text-lg font-semibold">{item.name}</Text>
//       <Text className="text-gray-500">
//         {new Date(item.createdAt).toLocaleDateString()}
//       </Text>
//       <Text className="text-blue-600 font-bold">{item.price}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
//       <Text className="text-xl font-bold dark:text-slate-300 mb-4">Home</Text>

//       {sellProperties?.length > 0 || rentProperties?.length > 0 ? (
//         <>
//           <Text className="text-lg dark:text-white mb-2">
//             Available for Sell
//           </Text>
//           <FlatList
//             data={sellProperties}
//             keyExtractor={(item) => item._id}
//             renderItem={renderPropertyItem}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />

//           <Text className="text-lg dark:text-white mt-4 mb-2">
//             Available for Rent
//           </Text>
//           <FlatList
//             data={rentProperties}
//             keyExtractor={(item) => item._id}
//             renderItem={renderPropertyItem}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />

//           {/* Modal for Property Details */}
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(!modalVisible)}
//           >
//             <View className="flex-1 justify-end bg-black bg-opacity-50">
//               <View className="w-full bg-white rounded-t-lg p-5">
//                 <Text className="text-center text-xl font-bold mb-2">
//                   {selectedProperty?.name}
//                 </Text>
//                 <Image
//                   source={{ uri: selectedProperty?.image }} // Assuming image URL is available
//                   style={{ width: "100%", height: 200, borderRadius: 10 }}
//                   resizeMode="cover"
//                 />
//                 <View className="flex-row justify-between items-center mt-2">
//                   <TouchableOpacity onPress={handleFavourite}>
//                     <Text
//                       className={`font-bold ${
//                         favouriteOn ? "text-red-500" : "text-gray-500"
//                       }`}
//                     >
//                       {favouriteOn ? "❤️ Favorited" : "🤍 Add to Favorites"}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => setModalVisible(false)}
//                     className="bg-red-500 p-2 rounded"
//                   >
//                     <Text className="text-white text-center">Close</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <Text className="text-center mt-2">
//                   {selectedProperty?.location}
//                 </Text>
//                 <Text className="text-center font-bold">
//                   {selectedProperty?.price}
//                 </Text>
//                 <Text className="text-center mt-2">
//                   {selectedProperty?.description}
//                 </Text>
//               </View>
//             </View>
//           </Modal>
//         </>
//       ) : (
//         <Text className="text-center dark:text-white">
//           No properties listed
//         </Text>
//       )}
//     </View>
//   );
// };

// export default Home;

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRentProperties,
  getAllSellProperties,
} from "../../store/property/propertySlice";
import { addToWishlist } from "../../store/auth/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favouriteOn, setFavouriteOn] = useState(false);

  const loadColorScheme = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      if (userData && userData.preference) {
        const storedMode = userData.preference.mode;
        setColorScheme(storedMode);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useEffect(() => {
    loadColorScheme();
    dispatch(getAllSellProperties());
    dispatch(getAllRentProperties());
  }, []);

  const { sellProperties, rentProperties } = useSelector(
    (state) => state.property
  );

  const handlePress = (prop) => {
    setSelectedProperty(prop);
    setFavouriteOn(prop.isFavorite); // Assuming prop contains isFavorite
    setModalVisible(true);
  };

  const handleFavourite = () => {
    const data = {
      prodId: selectedProperty?._id,
    };
    dispatch(addToWishlist(data));
    setFavouriteOn(!favouriteOn);
  };

  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      className="bg-white rounded-lg shadow-md p-4 m-2"
      style={{ width: 250 }} // Set a fixed width for each item
    >
      <Image
        source={{ uri: item.image }} // Assuming image URL is available
        className="w-full h-40 rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-lg font-semibold mt-2">{item.name}</Text>
      <Text className="text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text className="text-blue-600 font-bold">{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-xl font-bold dark:text-slate-300 mb-4">Home</Text>

      {sellProperties?.length > 0 || rentProperties?.length > 0 ? (
        <>
          <Text className="text-lg dark:text-white mb-2">
            Available for Sell
          </Text>
          <FlatList
            data={sellProperties}
            keyExtractor={(item) => item._id}
            renderItem={renderPropertyItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          <Text className="text-lg dark:text-white mt-4 mb-2">
            Available for Rent
          </Text>
          <FlatList
            data={rentProperties}
            keyExtractor={(item) => item._id}
            renderItem={renderPropertyItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          {/* Modal for Property Details */}
          <Modal
            animationType="slide"
            transparent={false} // Set to false for full-screen effect
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View className="flex-1 bg-white p-5">
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: selectedProperty?.image }} // Assuming image URL is available
                  style={{ width: "100%", height: "50%", borderRadius: 10 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={handleFavourite}
                  className="absolute top-4 right-4 bg-white bg-opacity-70 p-2 rounded-full"
                >
                  <Text
                    className={`font-bold ${
                      favouriteOn ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {favouriteOn ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-center text-xl font-bold mb-2">
                {selectedProperty?.name}
              </Text>
              <View className="flex-row justify-between items-center mt-2">
                <TouchableOpacity onPress={handleFavourite}>
                  <Text
                    className={`font-bold ${
                      favouriteOn ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {favouriteOn ? "Favorited" : "Add to Favorites"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-red-500 p-2 rounded"
                >
                  <Text className="text-white text-center">Close</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-center mt-2">
                {selectedProperty?.location}
              </Text>
              <Text className="text-center font-bold">
                {selectedProperty?.price}
              </Text>
              <Text className="text-center mt-2">
                {selectedProperty?.description}
              </Text>
            </View>
          </Modal>
        </>
      ) : (
        <Text className="text-center dark:text-white">
          No properties listed
        </Text>
      )}
    </View>
  );
};

export default Home;
