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
  Dimensions,
  Linking,
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
import { getAllPropertyTypes } from "../../store/propertyType/propertyTypeSlice";
import { getIconForField, getUnitForField } from "../../assets/utils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 64; // Full width minus padding
const CARD_IMAGE_WIDTH = SCREEN_WIDTH * 0.4; // 40% of screen width
const CARD_HEIGHT = CARD_IMAGE_WIDTH - 8;

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
const PropertyImages = memo(({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <View className="bg-gray-200 dark:bg-gray-700 h-full w-full items-center justify-center">
        <Ionicons
          name="image-outline"
          size={SCREEN_WIDTH * 0.06}
          color="#9CA3AF"
        />
      </View>
    );
  }

  return (
    <View className="relative h-full w-full">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / CARD_IMAGE_WIDTH
          );
          setActiveIndex(newIndex);
        }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width: CARD_IMAGE_WIDTH, height: CARD_HEIGHT }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Image counter */}
      {images.length > 1 && (
        <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-full">
          <Text
            className="text-white"
            style={{ fontSize: SCREEN_WIDTH * 0.03 }}
          >
            {activeIndex + 1}/{images.length}
          </Text>
        </View>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <View className="absolute bottom-2 left-0 right-0 flex-row justify-center space-x-1">
          {images.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full ${
                index === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
});

// Memoize the property card component
const PropertyCard = memo(({ item, onPress, onFavorite }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    className="mb-4 mx-4"
    style={{ width: CARD_WIDTH }}
  >
    <View
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md flex-row"
      style={{ height: CARD_HEIGHT }}
    >
      {/* Left: Image */}
      <View className="relative" style={{ width: CARD_IMAGE_WIDTH }}>
        <PropertyImages images={item.images} />
        <TouchableOpacity
          className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 p-1.5 rounded-full"
          onPress={() => onFavorite(item)}
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={SCREEN_WIDTH * 0.045}
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
            <Text
              className="text-blue-600 dark:text-blue-400 font-bold"
              style={{ fontSize: SCREEN_WIDTH * 0.045 }}
            >
              ${item.price}
            </Text>
            <View className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
              <Text
                className="text-green-600 dark:text-green-400 font-medium"
                style={{ fontSize: SCREEN_WIDTH * 0.03 }}
              >
                Available
              </Text>
            </View>
          </View>

          {/* Property Name */}
          <Text
            className="font-bold text-gray-800 dark:text-white mb-1"
            style={{ fontSize: SCREEN_WIDTH * 0.04 }}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          {/* Location */}
          <View className="flex-row items-center mb-2">
            <Ionicons
              name="location-sharp"
              size={SCREEN_WIDTH * 0.035}
              color="#6B7280"
            />
            <Text
              className="text-gray-500 dark:text-gray-400 ml-1"
              style={{ fontSize: SCREEN_WIDTH * 0.035 }}
              numberOfLines={1}
            >
              {item.location}
            </Text>
          </View>
        </View>

        {/* Bottom Section: Property Features */}
        <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          {["bed-outline", "water-outline", "square-outline"].map(
            (icon, index) => (
              <View key={icon} className="flex-row items-center">
                <Ionicons
                  name={icon}
                  size={SCREEN_WIDTH * 0.04}
                  color="#6B7280"
                />
                <Text
                  className="text-gray-600 dark:text-gray-300 ml-1"
                  style={{ fontSize: SCREEN_WIDTH * 0.035 }}
                >
                  {index === 0
                    ? item.bedrooms || "3"
                    : index === 1
                    ? item.bathrooms || "2"
                    : `${item.area || "1,200"} sqft`}
                </Text>
              </View>
            )
          )}
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
              <Text
                className="text-gray-800 dark:text-white font-semibold"
                style={{ fontSize: SCREEN_WIDTH * 0.045 }}
              >
                Filter Properties
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 mt-1"
                style={{ fontSize: SCREEN_WIDTH * 0.035 }}
              >
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

              {/* Location Filters Group */}
              <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <Text className="text-gray-800 dark:text-white font-semibold mb-4 flex-row items-center">
                  <Ionicons
                    name="location"
                    size={18}
                    color="#6B7280"
                    style={{ marginRight: 8 }}
                  />
                  Location Details
                </Text>

                {/* Region Picker */}
                <View className="mb-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Region
                  </Text>
                  <View className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <Picker
                      selectedValue={filterValues.region}
                      onValueChange={(value) => onChangeFilter.setRegion(value)}
                      style={{ height: 50, width: "100%" }}
                    >
                      <Picker.Item label="Select Region" value="" />
                      {filterValues.regions?.map((region) => (
                        <Picker.Item
                          key={region._id}
                          label={region.region_name}
                          value={region._id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Sub Region Picker */}
                <View className="mb-4">
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Sub Region
                  </Text>
                  <View
                    className={`bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${
                      !filterValues.region ? "opacity-50" : ""
                    }`}
                  >
                    <Picker
                      selectedValue={filterValues.subregion}
                      onValueChange={(value) =>
                        onChangeFilter.setSubregion(value)
                      }
                      style={{ height: 50, width: "100%" }}
                      enabled={!!filterValues.region}
                    >
                      <Picker.Item label="Select Sub Region" value="" />
                      {filterValues.filteredSubRegions?.map((subRegion) => (
                        <Picker.Item
                          key={subRegion._id}
                          label={subRegion.subregion_name}
                          value={subRegion._id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Location Picker */}
                <View>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Location
                  </Text>
                  <View
                    className={`bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${
                      !filterValues.subregion ? "opacity-50" : ""
                    }`}
                  >
                    <Picker
                      selectedValue={filterValues.location}
                      onValueChange={(value) =>
                        onChangeFilter.setLocation(value)
                      }
                      style={{ height: 50, width: "100%" }}
                      enabled={!!filterValues.subregion}
                    >
                      <Picker.Item label="Select Location" value="" />
                      {filterValues.filteredLocations?.map((location) => (
                        <Picker.Item
                          key={location._id}
                          label={location.location}
                          value={location._id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              {/* Property Type */}
              <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <Text className="text-gray-800 dark:text-white font-semibold mb-4 flex-row items-center">
                  <Ionicons
                    name="home"
                    size={18}
                    color="#6B7280"
                    style={{ marginRight: 8 }}
                  />
                  Property Details
                </Text>

                <View>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Property Type
                  </Text>
                  <View className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <Picker
                      selectedValue={filterValues.propertyType}
                      onValueChange={(value) =>
                        onChangeFilter.setPropertyType(value)
                      }
                      style={{ height: 50, width: "100%" }}
                    >
                      <Picker.Item label="Select Property Type" value="" />
                      {filterValues.propertyTypes?.map((type) => (
                        <Picker.Item
                          key={type._id}
                          label={type.name}
                          value={type._id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              {/* Property Use Selection */}
              <FilterOption icon="repeat-outline" label="Property Use">
                <View className="flex-row flex-wrap gap-2">
                  {propertyUseOptions?.map((option) => (
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

// Update the PropertyModal component to include image gallery
const PropertyModal = memo(
  ({
    visible,
    onClose,
    property,
    favouriteOn,
    onFavourite,
    onBuy,
    isPurchasing,
    showPaymentOptions,
    setShowPaymentOptions,
    paymentMethod,
    setPaymentMethod,
  }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!visible || !property) return null;

    // Format location string
    const locationString = [
      property?.address?.region?.region_name,
      property?.address?.subregion?.subregion_name,
      property?.address?.location?.location,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden">
            {/* Header with close button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <ScrollView className="flex-1">
              {/* Image Gallery */}
              <View
                className="relative"
                style={{ height: SCREEN_HEIGHT * 0.4 }}
              >
                {property.images && property.images.length > 0 ? (
                  <>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onMomentumScrollEnd={(e) => {
                        const newIndex = Math.round(
                          e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                        );
                        setActiveImageIndex(newIndex);
                      }}
                    >
                      {property.images?.map((image, index) => (
                        <Image
                          key={index}
                          source={{ uri: image }}
                          style={{
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT * 0.4,
                          }}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                    {/* Image counter */}
                    <View className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs">
                        {activeImageIndex + 1}/{property.images.length}
                      </Text>
                    </View>
                    {/* Dot indicators */}
                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-1">
                      {property.images?.map((_, index) => (
                        <View
                          key={index}
                          className={`h-1.5 rounded-full ${
                            index === activeImageIndex
                              ? "w-4 bg-white"
                              : "w-1.5 bg-white/60"
                          }`}
                        />
                      ))}
                    </View>
                  </>
                ) : (
                  <View className="w-full h-72 bg-gray-200 dark:bg-gray-700 items-center justify-center">
                    <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                  </View>
                )}
              </View>

              {/* Content */}
              <View className="p-6">
                {/* Title and Price Row */}
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {property.name}
                    </Text>
                    <Text className="text-xl font-bold text-[#FF8E01]">
                      ETB {property.price?.toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onFavourite(property)}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"
                  >
                    <Ionicons
                      name={favouriteOn ? "heart" : "heart-outline"}
                      size={24}
                      color={favouriteOn ? "#EF4444" : "#6B7280"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Location */}
                {locationString && (
                  <View className="flex-row items-start mb-4">
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#6B7280"
                    />
                    <Text className="text-gray-600 dark:text-gray-300 ml-2 flex-1">
                      {locationString}
                    </Text>
                  </View>
                )}

                {/* Property Details */}
                <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                  <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Property Details
                  </Text>
                  <View className="flex-row flex-wrap">
                    {property.propertyType?.name && (
                      <View className="w-1/2 mb-3">
                        <Text className="text-gray-500 dark:text-gray-400">
                          Type
                        </Text>
                        <Text className="text-gray-800 dark:text-white font-medium">
                          {property.propertyType.name}
                        </Text>
                      </View>
                    )}
                    <View className="w-1/2 mb-3">
                      <Text className="text-gray-500 dark:text-gray-400">
                        Status
                      </Text>
                      <Text className="text-gray-800 dark:text-white font-medium capitalize">
                        {property.property_use === "rent"
                          ? "For Rent"
                          : "For Sale"}
                      </Text>
                    </View>
                    {/* Dynamic Property Fields */}
                    {Object.entries(property.typeSpecificFields || {}).map(
                      ([key, value]) => {
                        if (
                          value === null ||
                          value === undefined ||
                          value === false ||
                          value === ""
                        ) {
                          return null;
                        }
                        return (
                          <View key={key} className="w-1/2 mb-3">
                            <Text className="text-gray-500 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </Text>
                            <View className="flex-row items-center">
                              <Ionicons
                                name={getIconForField(key)}
                                size={16}
                                color="#6B7280"
                                style={{ marginRight: 4 }}
                              />
                              <Text className="text-gray-800 dark:text-white font-medium">
                                {value}
                                {getUnitForField(key)}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>

                {/* Description */}
                {property.description && (
                  <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Description
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300">
                      {property.description}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View className="p-5 border-t border-gray-200 dark:border-gray-800">
              {property?.property_use === "rent" ? (
                // For Rental Properties
                <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                  <Text className="text-gray-800 dark:text-white font-semibold mb-2">
                    Contact Owner
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="call-outline" size={20} color="#6B7280" />
                      <Text className="text-gray-600 dark:text-gray-300 ml-2">
                        {property?.owner?.phone || "Phone not available"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`tel:${property?.owner?.phone}`)
                      }
                      className="bg-[#FF8E01] px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white font-medium">Call Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : showPaymentOptions ? (
                // For Sale Properties - Payment Options
                <View>
                  <PaymentMethodSelector
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                  <TouchableOpacity
                    onPress={onBuy}
                    disabled={isPurchasing}
                    className={`${
                      isPurchasing ? "bg-gray-400" : "bg-[#FF8E01]"
                    } rounded-xl py-4 px-6`}
                  >
                    <Text className="text-white text-center font-semibold text-base">
                      {isPurchasing ? "Processing..." : "Confirm Purchase"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Initial Buy Button
                <TouchableOpacity
                  onPress={() => setShowPaymentOptions(true)}
                  className="bg-[#FF8E01] rounded-xl py-4 px-6"
                >
                  <Text className="text-white text-center font-semibold text-base">
                    Buy Property
                  </Text>
                </TouchableOpacity>
              )}
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
  const { propertyTypes } = useSelector((state) => state.propertyType);

  useEffect(() => {
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
    dispatch(getAllPropertyTypes());
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
      {["cash", "bank_transfer", "mortgage"]?.map((method) => (
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
      <Text
        className="font-bold dark:text-slate-300 mb-4"
        style={{ fontSize: SCREEN_WIDTH * 0.06 }}
      >
        Explore Properties
      </Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white dark:bg-gray-800 p-4 rounded-2xl mb-4 flex-row items-center justify-between shadow-sm"
      >
        <View className="flex-row items-center">
          <Ionicons
            name="options-outline"
            size={SCREEN_WIDTH * 0.06}
            color="#6B7280"
          />
          <Text
            className="text-gray-700 dark:text-white ml-3 font-medium"
            style={{ fontSize: SCREEN_WIDTH * 0.04 }}
          >
            Filter Properties
          </Text>
        </View>
        <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
          <Text
            className="text-blue-600 dark:text-blue-400 font-medium"
            style={{ fontSize: SCREEN_WIDTH * 0.035 }}
          >
            {properties?.properties?.length || 0} Results
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={properties?.properties}
        keyExtractor={keyExtractor}
        renderItem={renderProperties}
        contentContainerStyle={{
          paddingVertical: SCREEN_WIDTH * 0.025,
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
          regions,
          filteredSubRegions,
          filteredLocations,
          propertyTypes,
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

      <PropertyModal
        visible={propertyDetailModalVisible}
        onClose={() => setPropertyDetailModalVisible(false)}
        property={selectedProperty}
        favouriteOn={favouriteOn}
        onFavourite={handleFavourite}
        onBuy={handleBuyProperty}
        isPurchasing={isPurchasing}
        showPaymentOptions={showPaymentOptions}
        setShowPaymentOptions={setShowPaymentOptions}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </View>
  );
};

export default memo(Explore);
