import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useCallback, memo } from "react";
import {
  changeFeatured,
  getUserProperties,
} from "../../store/property/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { getIconForField, getUnitForField } from "../../assets/utils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_PIXEL_8_WIDTH = 393; // Base width of Pixel 8
const SCALE_FACTOR = SCREEN_WIDTH / BASE_PIXEL_8_WIDTH;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.25; // 25% of screen height

const StatusFilter = memo(
  ({ activeFilter, onFilterChange, userProperties }) => {
    const filters = [
      {
        id: "available",
        label: "Active",
        icon: "checkmark-circle-outline",
        color: "bg-green-500",
      },
      {
        id: "pending",
        label: "Pending",
        icon: "time-outline",
        color: "bg-yellow-500",
      },
      {
        id: "rejected",
        label: "Rejected",
        icon: "close-circle-outline",
        color: "bg-red-500",
      },
    ];

    return (
      <View
        className="flex-row justify-between mb-4"
        style={{ paddingHorizontal: 16 * SCALE_FACTOR }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onFilterChange(filter.id)}
            className={`flex-1 mx-1 rounded-full flex-row items-center justify-center ${
              activeFilter === filter.id
                ? "bg-[#FF8E01] border-orange-400"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            } border`}
            style={{
              transform: [{ scale: activeFilter === filter.id ? 1.05 : 1 }],
              padding: 12 * SCALE_FACTOR,
            }}
          >
            <Ionicons
              name={filter.icon}
              size={18 * SCALE_FACTOR}
              color={activeFilter === filter.id ? "#FFFFFF" : "#6B7280"}
              style={{ marginRight: 6 * SCALE_FACTOR }}
            />
            <Text
              className={`${
                activeFilter === filter.id
                  ? "text-white font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              style={{ fontSize: 14 * SCALE_FACTOR }}
            >
              {filter.label}
              <Text style={{ fontSize: 12 * SCALE_FACTOR, opacity: 0.7 }}>
                {" "}
                (
                {userProperties?.properties?.filter(
                  (p) => p.status === filter.id
                ).length || 0}
                )
              </Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
);

const PropertyCard = memo(({ item, onPress, handleBoost }) => (
  <TouchableOpacity
    className="mb-4"
    style={{
      marginHorizontal: 16 * SCALE_FACTOR,
    }}
    onPress={() => onPress(item)}
  >
    <View
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md flex-row"
      style={{ height: CARD_HEIGHT }}
    >
      <View className="relative" style={{ width: CARD_HEIGHT }}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={{
              width: CARD_HEIGHT - 24 * SCALE_FACTOR,
              height: CARD_HEIGHT - 24 * SCALE_FACTOR,
              margin: 10 * SCALE_FACTOR,
            }}
            resizeMode="cover"
            className="rounded-xl"
          />
        ) : (
          <View
            style={{
              width: CARD_HEIGHT - 24 * SCALE_FACTOR,
              height: CARD_HEIGHT - 24 * SCALE_FACTOR,
              margin: 10 * SCALE_FACTOR,
            }}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl items-center justify-center"
          >
            <Ionicons
              name="image-outline"
              size={32 * SCALE_FACTOR}
              color="#9CA3AF"
            />
          </View>
        )}
        <View
          className="absolute top-2 right-2 bg-green-500/90 dark:bg-green-600/90 rounded-full"
          style={{
            paddingHorizontal: 8 * SCALE_FACTOR,
            paddingVertical: 4 * SCALE_FACTOR,
          }}
        >
          <Text
            className="text-white font-medium"
            style={{ fontSize: 12 * SCALE_FACTOR }}
          >
            {item.property_use === "rent" ? "For Rent" : "For Sale"}
          </Text>
        </View>
      </View>

      <View
        className="flex-1 justify-between"
        style={{ padding: 16 * SCALE_FACTOR }}
      >
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text
              className="text-blue-600 dark:text-blue-400 font-bold"
              style={{ fontSize: 18 * SCALE_FACTOR }}
            >
              ${item.price?.toLocaleString() || "0"}
            </Text>
            <View className="bg-blue-100 dark:bg-blue-900 rounded-full">
              <TouchableOpacity
                onPress={() => handleBoost(item)}
                style={{
                  paddingHorizontal: 8 * SCALE_FACTOR,
                  paddingVertical: 4 * SCALE_FACTOR,
                }}
              >
                <Text
                  className="text-blue-600 dark:text-blue-400 font-medium"
                  style={{ fontSize: 12 * SCALE_FACTOR }}
                >
                  {item.isFeatured ? "Featured" : "Boost"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            className="font-bold text-gray-800 dark:text-white mb-1"
            style={{ fontSize: 16 * SCALE_FACTOR }}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          {item.address && (
            <View className="space-y-1 mb-2">
              <View className="flex-row items-center">
                <Ionicons
                  name="location-sharp"
                  size={14 * SCALE_FACTOR}
                  color="#6B7280"
                />
                <Text
                  className="text-gray-500 dark:text-gray-400 ml-1"
                  style={{ fontSize: 14 * SCALE_FACTOR }}
                  numberOfLines={1}
                >
                  {item?.address?.subregion?.subregion_name || " "},{" "}
                  {item?.address?.location?.location || " "}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View
          className="flex-row justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700"
          style={{ marginTop: 8 * SCALE_FACTOR }}
        >
          <Text
            className="text-gray-500 dark:text-gray-400"
            style={{ fontSize: 12 * SCALE_FACTOR }}
          >
            Posted {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View className="flex-row items-center">
            <Ionicons
              name="eye-outline"
              size={14 * SCALE_FACTOR}
              color="#6B7280"
            />
            <Text
              className="text-gray-500 dark:text-gray-400 ml-1"
              style={{ fontSize: 12 * SCALE_FACTOR }}
            >
              {item.views?.count || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

const Listing = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("available");

  useEffect(() => {
    dispatch(getUserProperties());
  }, [dispatch]);

  const { userProperties } = useSelector((state) => state.property);

  const handlePropertyPress = useCallback((property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  }, []);

  const handleBoostProperty = useCallback(
    (property) => {
      router.push({
        pathname: "/boost_payment",
        params: { propertyId: property._id },
      });
    },
    [router]
  );

  const renderProperties = useCallback(
    ({ item }) => (
      <PropertyCard
        item={item}
        onPress={handlePropertyPress}
        handleBoost={handleBoostProperty}
      />
    ),
    [handlePropertyPress]
  );

  const filteredProperties =
    userProperties?.properties?.filter((property) =>
      statusFilter === "all" ? true : property.status === statusFilter
    ) || [];

  return (
    <View className="flex-1 bg-gray-100 dark:bg-[#09092B]">
      <View
        style={{
          paddingHorizontal: 20 * SCALE_FACTOR,
          paddingTop: 32 * SCALE_FACTOR,
          paddingBottom: 16 * SCALE_FACTOR,
        }}
      >
        <Text
          className="font-bold text-gray-800 dark:text-white"
          style={{ fontSize: 28 * SCALE_FACTOR }}
          onPress={() => console.log(userProperties?.properties)}
        >
          My Listings
        </Text>
        <Text
          className="text-gray-500 dark:text-gray-400 mt-1"
          style={{ fontSize: 16 * SCALE_FACTOR }}
        >
          {userProperties?.properties?.length || 0} active properties
        </Text>
      </View>

      <StatusFilter
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        userProperties={userProperties}
      />

      {userProperties?.properties?.length > 0 ? (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item._id}
          renderItem={renderProperties}
          contentContainerStyle={{
            paddingVertical: 10 * SCALE_FACTOR,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={5}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="home-outline"
            size={48 * SCALE_FACTOR}
            color="#6B7280"
          />
          <Text
            className="text-gray-500 dark:text-gray-400 mt-4"
            style={{ fontSize: 18 * SCALE_FACTOR }}
          >
            No listings posted yet
          </Text>
        </View>
      )}

      {modalVisible && (
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-white dark:bg-gray-900">
            <View
              className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
              style={{
                paddingTop: 48 * SCALE_FACTOR,
                paddingBottom: 16 * SCALE_FACTOR,
                paddingHorizontal: 20 * SCALE_FACTOR,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="absolute left-5 top-12 z-10 bg-white/90 dark:bg-gray-800/90 rounded-full"
                style={{ padding: 8 * SCALE_FACTOR }}
              >
                <Ionicons
                  name="close"
                  size={24 * SCALE_FACTOR}
                  color="#6B7280"
                />
              </TouchableOpacity>
              <Text
                className="text-center font-bold text-gray-800 dark:text-white"
                style={{ fontSize: 20 * SCALE_FACTOR }}
              >
                Property Details
              </Text>
            </View>

            {selectedProperty && (
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
              >
                {selectedProperty.images &&
                selectedProperty.images.length > 0 ? (
                  <Image
                    source={{ uri: selectedProperty.images[0] }}
                    className="w-screen h-72"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-screen h-72 bg-gray-200 dark:bg-gray-700 items-center justify-center">
                    <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                  </View>
                )}

                <View className="p-5">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${selectedProperty.price?.toLocaleString()}
                    </Text>
                    <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full">
                      <Text className="text-blue-600 dark:text-blue-400 font-medium">
                        {selectedProperty.propertyType?.name || "Property"}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {selectedProperty.title}
                  </Text>

                  {selectedProperty.address && (
                    <View className="flex-row items-center mb-4">
                      <Ionicons name="location" size={20} color="#6B7280" />
                      <Text className="text-gray-600 dark:text-gray-300 ml-2 text-base">
                        {selectedProperty.address.subregion?.subregion_name ||
                          ""}
                        , {selectedProperty.address.location?.location || ""}
                      </Text>
                    </View>
                  )}

                  {selectedProperty.typeSpecificFields && (
                    <View className="mb-4">
                      <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Property Details
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-row"
                      >
                        {Object.entries(
                          selectedProperty.typeSpecificFields
                        ).map(([key, value], index) => (
                          <View
                            key={key}
                            className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mr-3 min-w-[120px] items-center ${
                              index === 0 ? "ml-0" : ""
                            }`}
                          >
                            <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mb-2">
                              <Ionicons
                                name={getIconForField(key)}
                                size={20}
                                color="#3B82F6"
                              />
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm capitalize mb-1">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </Text>
                            <Text className="text-gray-800 dark:text-gray-200 font-semibold">
                              {value.toString()}
                              {getUnitForField(key)}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Description
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedProperty.description || "No description available"}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View className="p-5 border-t border-gray-200 dark:border-gray-800">
              <TouchableOpacity
                className="bg-[#FF8E01] rounded-xl py-4 px-6"
                onPress={() => {
                  setModalVisible(false);
                  router.push({
                    pathname: "/edit_property",
                    params: { property: JSON.stringify(selectedProperty) },
                  });
                }}
              >
                <Text className="text-white text-center font-semibold text-base">
                  Edit Property
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default memo(Listing);
