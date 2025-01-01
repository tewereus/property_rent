import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProperties,
  buyProperty,
  changeView,
  getAllViews,
} from "../../store/property/propertySlice";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { useLocalSearchParams } from "expo-router";
import {
  getAllLocations,
  getAllRegions,
  getAllSubRegions,
} from "../../store/address/addressSlice";
import { Picker } from "@react-native-picker/picker";
import { addToWishlist } from "../../store/auth/authSlice";

// Memoize the FilterOption component
const FilterOption = memo(({ icon, label, children }) => (
  <View className="mb-6">
    <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex-row items-center">
      <Ionicons
        name={icon}
        size={16}
        color="#6B7280"
        style={{ marginRight: 8 }}
      />
      {label}
    </Text>
    {children}
  </View>
));

// Memoize the property card component
const PropertyCard = memo(({ item, onPress, onFavorite }) => (
  <TouchableOpacity onPress={() => onPress(item)} className="mb-4 mx-4">
    <View
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md flex-row"
      style={{ height: 160 }}
    >
      {/* Left: Image */}
      <View className="relative" style={{ width: 160 }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: 160, height: 160 }}
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 p-1.5 rounded-full"
          onPress={() => onFavorite(item)}
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={item.isFavorite ? "#EF4444" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Right: Content */}
      <View className="flex-1 p-4 justify-between">
        {/* Top Section */}
        <View>
          {/* Price and Status */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-blue-600 dark:text-blue-400 font-bold text-lg">
              ${item.price}
            </Text>
            <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
              <Text className="text-green-600 dark:text-green-400 text-xs font-medium">
                Available
              </Text>
            </View>
          </View>

          {/* Property Name */}
          <Text
            className="text-lg font-bold text-gray-800 dark:text-white mb-1"
            numberOfLines={1}
          >
            {item.name}
          </Text>

          {/* Location */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-sharp" size={14} color="#6B7280" />
            <Text
              className="text-gray-500 dark:text-gray-400 ml-1 text-sm"
              numberOfLines={1}
            >
              {item.location}
            </Text>
          </View>
        </View>

        {/* Bottom Section: Property Features */}
        <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center">
            <Ionicons name="bed-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 dark:text-gray-300 ml-1 text-sm">
              {item.bedrooms || "3"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="water-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 dark:text-gray-300 ml-1 text-sm">
              {item.bathrooms || "2"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="square-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 dark:text-gray-300 ml-1 text-sm">
              {item.area || "1,200"} sqft
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

// Memoize the filter modal content
const FilterModal = memo(
  ({ visible, onClose, filterValues, onChangeFilter, onSubmit }) => {
    const propertyUseOptions = [
      { label: "All", value: "" },
      { label: "Rent", value: "rent" },
      { label: "Sell", value: "sell" },
    ];

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/20">
          <View className="flex-1 bg-white dark:bg-gray-900 mt-24 rounded-t-3xl">
            {/* Modal Header */}
            <View className="relative border-b border-gray-200 dark:border-gray-800 p-6">
              <TouchableOpacity
                onPress={onClose}
                className="absolute right-6 top-6 z-50 p-2"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Filter Properties
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Customize your search preferences
              </Text>
            </View>

            {/* Filter Content */}
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {/* Limit */}
              <FilterOption icon="filter-outline" label="Number of Results">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder={`Current limit: ${filterValues.limit}`}
                    keyboardType="numeric"
                    value={filterValues.limit.toString()}
                    onChangeText={(text) => onChangeFilter.setLimit(text)}
                    className="text-gray-700 dark:text-gray-300 text-base"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </FilterOption>

              {/* Price Range */}
              <FilterOption icon="cash-outline" label="Price Range">
                <View className="flex-row space-x-4">
                  <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <TextInput
                      placeholder="Min Price"
                      keyboardType="numeric"
                      value={filterValues.minPrice.toString()}
                      onChangeText={(text) => onChangeFilter.setMinPrice(text)}
                      className="text-gray-700 dark:text-gray-300"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                  <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <TextInput
                      placeholder="Max Price"
                      keyboardType="numeric"
                      value={filterValues.maxPrice.toString()}
                      onChangeText={(text) => onChangeFilter.setMaxPrice(text)}
                      className="text-gray-700 dark:text-gray-300"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                </View>
              </FilterOption>

              {/* Location */}
              <FilterOption icon="location-outline" label="Location">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder="Enter location"
                    value={filterValues.location}
                    onChangeText={(text) => onChangeFilter.setLocation(text)}
                    className="text-gray-700 dark:text-gray-300"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </FilterOption>

              {/* Region Picker */}
              <FilterOption icon="location-outline" label="Region">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <Picker
                    selectedValue={filterValues.region}
                    onValueChange={(value) => onChangeFilter.setRegion(value)}
                    style={{ height: 50, width: "100%" }}
                  >
                    <Picker.Item label="Select Region" value="" />
                    {filterValues.regions.map((region) => (
                      <Picker.Item
                        key={region._id}
                        label={region.region_name}
                        value={region._id}
                      />
                    ))}
                  </Picker>
                </View>
              </FilterOption>

              {/* Sub Region Picker */}
              <FilterOption icon="location-outline" label="Sub Region">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <Picker
                    selectedValue={filterValues.subregion}
                    onValueChange={(value) =>
                      onChangeFilter.setSubregion(value)
                    }
                    style={{ height: 50, width: "100%" }}
                    enabled={!!filterValues.region}
                  >
                    <Picker.Item label="Select Sub Region" value="" />
                    {filterValues.filteredSubRegions.map((subRegion) => (
                      <Picker.Item
                        key={subRegion._id}
                        label={subRegion.subregion_name}
                        value={subRegion._id}
                      />
                    ))}
                  </Picker>
                </View>
              </FilterOption>

              {/* Location Picker */}
              <FilterOption icon="location-outline" label="Location">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <Picker
                    selectedValue={filterValues.location}
                    onValueChange={(value) => onChangeFilter.setLocation(value)}
                    style={{ height: 50, width: "100%" }}
                    enabled={!!filterValues.subregion}
                  >
                    <Picker.Item label="Select Location" value="" />
                    {filterValues.filteredLocations.map((location) => (
                      <Picker.Item
                        key={location._id}
                        label={location.location}
                        value={location._id}
                      />
                    ))}
                  </Picker>
                </View>
              </FilterOption>

              {/* Property Type */}
              <FilterOption icon="home-outline" label="Property Type">
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder="Enter property type"
                    value={filterValues.propertyType}
                    onChangeText={(text) =>
                      onChangeFilter.setPropertyType(text)
                    }
                    className="text-gray-700 dark:text-gray-300"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </FilterOption>

              {/* Property Use Selection */}
              <FilterOption icon="repeat-outline" label="Property Use">
                <View className="flex-row flex-wrap gap-2">
                  {propertyUseOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() =>
                        onChangeFilter.setPropertyUse(option.value)
                      }
                      className={`px-4 py-2 rounded-xl ${
                        filterValues.propertyUse === option.value
                          ? "bg-[#FF8E01] border-[#FF8E01]"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      } border`}
                    >
                      <Text
                        className={`${
                          filterValues.propertyUse === option.value
                            ? "text-white"
                            : "text-gray-700 dark:text-gray-300"
                        } font-medium`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </FilterOption>
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-6 border-t border-gray-200 dark:border-gray-800">
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl"
                >
                  <Text className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onSubmit}
                  className="flex-1 bg-[#FF8E01] p-4 rounded-xl"
                >
                  <Text className="text-white text-center font-medium">
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const Explore = () => {
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [limit, setLimit] = useState(5);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [subregion, setSubregion] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyUse, setPropertyUse] = useState(params.propertyUse || "");

  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const [propertyDetailModalVisible, setPropertyDetailModalVisible] =
    useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favouriteOn, setFavouriteOn] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const { regions, subregions, locations } = useSelector(
    (state) => state.address
  );

  const { properties, views } = useSelector((state) => state.property);

  useEffect(() => {
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
  }, []);

  useEffect(() => {
    const { filterType, propertyUse } = params;

    let newFilters = {};

    if (filterType) {
      setPropertyType(filterType);
      newFilters.propertyType = filterType;
    }

    if (propertyUse) {
      setPropertyUse(propertyUse);
      newFilters.propertyUse = propertyUse;
    }

    // Remove empty filters
    Object.keys(newFilters).forEach((key) => {
      if (!newFilters[key]) {
        delete newFilters[key];
      }
    });

    dispatch(getAllProperties(newFilters));
  }, [params.filterType, params.propertyUse]);

  useEffect(() => {
    if (region) {
      const regionSubRegions = subregions.filter(
        (subRegion) => subRegion.region_id?._id === region
      );
      setFilteredSubRegions(regionSubRegions);
      // Reset dependent fields
      // setRegion("");
      // setLocation("");
      setFilteredLocations([]);
    }
  }, [region, subregions]);

  // Handle subregion selection
  useEffect(() => {
    if (subregion) {
      // console.log("subRegionLocations");
      const subRegionLocations = locations.filter(
        (location) => location?.subregion_id?._id === subregion
      );
      console.log(subRegionLocations);
      setFilteredLocations(subRegionLocations);
      // setLocation("");
    }
  }, [subregion, region, locations]);

  const handlePress = useCallback(
    async (prop) => {
      try {
        const data = {
          propertyId: prop._id,
        };
        setSelectedProperty(prop);
        setFavouriteOn(prop.isFavorite);
        setPropertyDetailModalVisible(true);
        setShowPaymentOptions(false);

        await dispatch(changeView(data)).unwrap();
      } catch (error) {
        console.log("Error updating view:", error);
      }
    },
    [dispatch]
  );

  const handleFavourite = useCallback(
    async (prop) => {
      try {
        setFavouriteOn(!favouriteOn);
        const data = {
          prodId: prop._id,
        };
        await dispatch(addToWishlist(data)).unwrap();
      } catch (error) {
        console.error("Error updating favorite:", error);
        setFavouriteOn(favouriteOn);
      }
    },
    [favouriteOn, dispatch]
  );

  const handleScheduleVisit = () => {
    setIsSchedulingVisit(true);
    Alert.alert(
      "Schedule Visit",
      "Our agent will contact you shortly to arrange a visit.",
      [
        {
          text: "OK",
          onPress: () => setIsSchedulingVisit(false),
        },
      ]
    );
  };

  const handleBuyProperty = async () => {
    if (!selectedProperty?._id) return;

    setIsPurchasing(true);
    try {
      await dispatch(
        buyProperty({
          propertyId: selectedProperty._id,
          paymentMethod: paymentMethod,
        })
      ).unwrap();

      Alert.alert(
        "Success",
        "Property purchase initiated successfully! Check your transactions for details.",
        [
          {
            text: "OK",
            onPress: () => {
              setPropertyDetailModalVisible(false);
              setShowPaymentOptions(false);
              setPaymentMethod("cash");
              dispatch(getAllProperties({}));
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error || "Failed to initiate property purchase. Please try again later."
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSubmit = useCallback(() => {
    const obj = {
      limit: parseInt(limit),
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      location,
      propertyType,
      propertyUse,
      region,
      subregion,
    };

    // Remove undefined, null, or empty string values
    const cleanedObj = Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log("Submitting filters:", cleanedObj);
    dispatch(getAllProperties(cleanedObj));
    setModalVisible(false);
  }, [
    limit,
    minPrice,
    maxPrice,
    location,
    propertyType,
    propertyUse,
    region,
    subregion,
  ]);

  useEffect(() => {
    if (!propertyDetailModalVisible) {
      setSelectedProperty(null);
      setShowPaymentOptions(false);
      setPaymentMethod("cash");
    }
  }, [propertyDetailModalVisible]);

  const PaymentMethodSelector = memo(({ paymentMethod, setPaymentMethod }) => (
    <View className="mb-4">
      <Text className="text-gray-800 dark:text-white font-semibold mb-2">
        Select Payment Method
      </Text>
      {["cash", "bank_transfer", "mortgage"].map((method) => (
        <TouchableOpacity
          key={method}
          onPress={() => setPaymentMethod(method)}
          className={`flex-row items-center p-4 rounded-xl mb-2 ${
            paymentMethod === method
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <Ionicons
            name={
              method === "cash"
                ? "cash-outline"
                : method === "bank_transfer"
                ? "card-outline"
                : "business-outline"
            }
            size={24}
            color={paymentMethod === method ? "#3B82F6" : "#6B7280"}
          />
          <Text
            className={`ml-3 capitalize ${
              paymentMethod === method
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {method.replace("_", " ")}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  ));

  const renderProperties = useCallback(
    ({ item }) => (
      <PropertyCard
        item={item}
        onPress={handlePress}
        onFavorite={handleFavourite}
      />
    ),
    [handlePress, handleFavourite]
  );

  const keyExtractor = useCallback((item) => item._id, []);

  useEffect(() => {
    const obj = {
      limit: parseInt(limit),
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      location,
      propertyType,
    };
    dispatch(getAllProperties(obj));
  }, []);

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-2xl font-bold dark:text-slate-300 mb-4">
        Explore Properties
      </Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white dark:bg-gray-800 p-4 rounded-2xl mb-4 flex-row items-center justify-between shadow-sm"
      >
        <View className="flex-row items-center">
          <Ionicons name="options-outline" size={24} color="#6B7280" />
          <Text className="text-gray-700 dark:text-white ml-3 text-base font-medium">
            Filter Properties
          </Text>
        </View>
        <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
          <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            {properties?.properties?.length || 0} Results
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={properties?.properties}
        keyExtractor={keyExtractor}
        renderItem={renderProperties}
        contentContainerStyle={{
          paddingVertical: 10,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
      />

      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filterValues={{
          limit,
          minPrice,
          maxPrice,
          location,
          propertyType,
          propertyUse,
          region,
          subregion,
          location,
          regions,
          filteredSubRegions,
          filteredLocations,
        }}
        onChangeFilter={{
          setLimit,
          setMinPrice,
          setMaxPrice,
          setLocation,
          setPropertyType,
          setPropertyUse,
          setRegion,
          setSubregion,
          setLocation,
        }}
        onSubmit={handleSubmit}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={propertyDetailModalVisible}
        onRequestClose={() => setPropertyDetailModalVisible(false)}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          <View className="relative bg-white dark:bg-gray-900 pt-12 pb-4 px-5">
            <TouchableOpacity
              onPress={() => setPropertyDetailModalVisible(false)}
              className="absolute left-5 top-12 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-center text-xl font-bold text-gray-800 dark:text-white">
              Property Details
            </Text>
          </View>

          {selectedProperty && (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="relative">
                <Image
                  source={{ uri: selectedProperty.image }}
                  className="w-screen h-72"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => handleFavourite(selectedProperty)}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full z-10"
                >
                  <Ionicons
                    name={favouriteOn ? "heart" : "heart-outline"}
                    size={24}
                    color={favouriteOn ? "#EF4444" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              <View className="p-5">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${selectedProperty.price.toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    onPress={handleScheduleVisit}
                    disabled={isSchedulingVisit}
                    className="flex-row items-center bg-green-500 px-4 py-2 rounded-full"
                  >
                    {isSchedulingVisit ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="white"
                        />
                        <Text className="text-white font-semibold ml-2">
                          Schedule Visit
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {selectedProperty.title}
                </Text>

                <View className="flex-row items-center mb-4">
                  <Ionicons name="location" size={20} color="#6B7280" />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2 text-base">
                    {selectedProperty.location}
                  </Text>
                </View>

                <View className="flex-row justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                  <View className="items-center">
                    <Ionicons name="bed-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.bedrooms || "3"} Beds
                    </Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="water-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.bathrooms || "2"} Baths
                    </Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="square-outline" size={24} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {selectedProperty.area || "1,200"} sqft
                    </Text>
                  </View>
                </View>

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
            {showPaymentOptions ? (
              <View>
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
                <TouchableOpacity
                  onPress={handleBuyProperty}
                  disabled={isPurchasing}
                  className={`${
                    isPurchasing ? "bg-gray-400" : "bg-[#FF8E01]"
                  } rounded-xl py-4 px-6`}
                >
                  {isPurchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-base">
                      Confirm{" "}
                      {selectedProperty?.property_use === "rent"
                        ? "Rental"
                        : "Purchase"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowPaymentOptions(true)}
                className="bg-[#FF8E01] rounded-xl py-4 px-6"
              >
                <Text className="text-white text-center font-semibold text-base">
                  {selectedProperty?.property_use === "rent"
                    ? "Rent Property"
                    : "Buy Property"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(Explore);
