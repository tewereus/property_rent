// import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getWishlists } from "../../store/auth/authSlice";

// const Bookmark = () => {
//   const dispatch = useDispatch();
//   const [selectedWishlist, setSelectedWishlist] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     dispatch(getWishlists());
//   }, []);

//   const { wishlist } = useSelector((state) => state.auth);

//   const handleWishlist = (wish) => {
//     setSelectedWishlist(wish);
//     setModalVisible(true);
//   };

//   const renderWishlist = ({ item }) => (
//     <TouchableOpacity onPress={() => handleWishlist(item)}>
//       <View
//         style={{
//           backgroundColor: "grey",
//           padding: "20px",
//           marginBottom: "20px",
//         }}
//       >
//         <Text onPress={() => console.log(selectedWishlist)}>{item.name}</Text>
//         <Text>{item.location}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
//       <Text
//         className="text-lg dark:text-slate-300"
//         onPress={() => console.log(wishlist?.wishlist)}
//       >
//         Bookmark
//       </Text>
//       <FlatList
//         data={wishlist?.wishlist}
//         keyExtractor={(item) => item._id}
//         renderItem={renderWishlist}
//       />

//       <Modal
//         animationType="none"
//         transparent={false}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View className="flex-1 justify-end bg-black bg-opacity-50">
//           <View className="w-full bg-white rounded-t-lg p-5">
//             <Text
//               className="text-center"
//               onPress={() => console.log(selectedWishlist)}
//             >
//               View Favourite
//             </Text>
//             {/* <FlatList
//                   data={images}
//                   keyExtractor={(item)=> item}
//                   renderItem={}
//                 /> */}
//             <View
//               style={{
//                 backgroundColor: "red",
//                 height: "20vh",
//                 width: "45vh",
//                 justifyContent: "center",
//                 alignSelf: "center",
//               }}
//             >
//               <Text className="text-center">Image here</Text>

//               {/* <Image
//                   source={icons.star}
//                   className="max-w-[380px] w-full h-[298px]"
//                   resizeMode="contain"
//                 /> */}
//             </View>
//             {/* <Text className="text-center">{selectedProperty?.name}</Text>
//                 <Text className="text-center">
//                   {selectedProperty?.location}
//                 </Text>
//                 <Text className="text-center">{selectedProperty?.price}</Text>
//                 <Text className="text-center">Description</Text>
//                 <Text className="text-center">
//                   {selectedProperty?.description}
//                 </Text> */}

//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               className="bg-red-500 p-2 rounded"
//             >
//               <Text className="text-white text-center">Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default Bookmark;

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlists } from "../../store/auth/authSlice";

const Bookmark = () => {
  const dispatch = useDispatch();
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getWishlists());
  }, [dispatch]);

  const { wishlist } = useSelector((state) => state.auth);

  const handleWishlist = (wish) => {
    setSelectedWishlist(wish);
    setModalVisible(true);
  };

  const renderWishlist = ({ item }) => (
    <TouchableOpacity onPress={() => handleWishlist(item)}>
      <View className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 mb-4 shadow">
        <Text className="text-lg font-semibold dark:text-white">
          {item.name}
        </Text>
        <Text className="text-gray-600 dark:text-gray-300">
          {item.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-xl font-bold dark:text-slate-300 mb-4">
        Bookmarks
      </Text>
      <FlatList
        data={wishlist?.wishlist}
        keyExtractor={(item) => item._id}
        renderItem={renderWishlist}
        contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom of the list
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 bg-white dark:bg-gray-900 p-5">
          <Text className="text-center text-xl font-bold mb-4 dark:text-white">
            View Favourite
          </Text>

          {/* Placeholder for image */}
          <View className="bg-red-500 h-48 rounded-lg justify-center items-center mb-4">
            <Text className="text-white text-center">Image here</Text>
            {/* You can replace this with an Image component */}
          </View>

          {/* Display selected wishlist details */}
          {selectedWishlist && (
            <>
              <Text className="text-center text-lg font-semibold dark:text-white">
                {selectedWishlist.name}
              </Text>
              <Text className="text-center text-gray-600 dark:text-gray-300">
                {selectedWishlist.location}
              </Text>
            </>
          )}

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-red-500 p-2 rounded mt-4"
          >
            <Text className="text-white text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Bookmark;
