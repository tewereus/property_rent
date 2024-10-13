// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import React, { useEffect } from "react";
// import { getAllUsersProperties } from "../../store/property/propertySlice";
// import { useDispatch, useSelector } from "react-redux";

// const Listing = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getAllUsersProperties());
//   }, []);

//   const { userProperties } = useSelector((state) => state.property);

//   const renderProperties = ({ item }) => (
//     <View className="bg-white rounded-lg p-4 mb-2 shadow-md flex-row justify-between items-center">
//       <View>
//         <Text className="text-gray-800 font-semibold">{item.name}</Text>
//         <Text className="text-gray-600">
//           {new Date(item.createdAt).toLocaleDateString()}
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <View className="bg-[#09092B] w-full min-h-screen">
//       <Text onPress={() => console.log(userProperties)}>Listing</Text>
//       {userProperties?.length > 0 ? (
//         <View>
//           <Text>Active Listing</Text>
//           <FlatList
//             data={userProperties}
//             keyExtractor={(item) => item._id}
//             renderItem={renderProperties}
//             contentContainerStyle={{ paddingBottom: 20 }}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       ) : (
//         <Text>No listing posted</Text>
//       )}
//     </View>
//   );
// };

// export default Listing;

import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { getAllUsersProperties } from "../../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";

const Listing = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsersProperties());
  }, [dispatch]);

  const { userProperties } = useSelector((state) => state.property);

  const renderProperties = ({ item }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-md flex-row justify-between items-center">
      <View>
        <Text className="text-gray-800 dark:text-white font-semibold">
          {item.name}
        </Text>
        <Text className="text-gray-600 dark:text-gray-300">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-xl font-bold dark:text-slate-300 mb-4">
        Listings
      </Text>
      {userProperties?.length > 0 ? (
        <View>
          <Text className="text-lg font-semibold dark:text-white mb-2">
            Active Listings
          </Text>
          <FlatList
            data={userProperties}
            keyExtractor={(item) => item._id}
            renderItem={renderProperties}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <Text className="text-center dark:text-gray-300">
          No listings posted
        </Text>
      )}
    </View>
  );
};

export default Listing;
