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
import {
  addToWishlist,
  changeLanguage,
  changeLanguageMode,
} from "../../store/auth/authSlice";
import { useTranslation } from "react-i18next";

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

  const { sellProperties, rentProperties, isSuccess } = useSelector(
    (state) => state.property
  );

  const { t, i18n } = useTranslation();

  const handlePress = (prop) => {
    setSelectedProperty(prop);
    setFavouriteOn(prop.isFavorite);
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
      style={{ width: 250 }}
    >
      <Image
        source={{ uri: item.image }}
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

  const changeLanguage = (lng) => {
    const data = {
      preference: {
        language: lng,
      },
    };
    i18n.changeLanguage(lng);
    dispatch(changeLanguageMode(data));
  };

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <View className="flex flex-row justify-between mt-2">
        <Text className="text-xl font-bold dark:text-slate-300 mb-4">Home</Text>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => changeLanguage("Eng")}
            className="dark:text-slate-300"
          >
            <Text style={{ marginRight: 10 }} className="dark:text-slate-300">
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage("Amh")}>
            <Text className="dark:text-slate-300">ኣማርኛ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {sellProperties?.length > 0 || rentProperties?.length > 0 ? (
        <>
          <Text className="text-lg dark:text-white mb-2">
            {t("available_for_sell")}
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
            {t("available_for_rent")}
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
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View className="flex-1 bg-white p-5">
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: selectedProperty?.image }}
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
