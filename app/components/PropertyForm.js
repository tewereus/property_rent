import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import FormField from "./FormField";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text } from "react-native";

const PropertyForm = ({ formData, setFormData, propertyType }) => {
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload images!");
      return;
    }

    // Pick the image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultiple: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((image) => ({
        uri: image.uri,
        type: "image/jpeg",
        fileName: image.uri.split("/").pop(),
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const renderField = (field) => {
    const value = formData.typeSpecificFields?.[field.name] || "";

    return (
      <FormField
        key={field.name}
        title={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
        value={value.toString()}
        placeholder={`Enter ${field.name}`}
        handleChangeText={(e) => {
          let parsedValue;
          switch (field.type) {
            case "Number":
              parsedValue = parseInt(e);
              break;
            case "Boolean":
              parsedValue = e === "true";
              break;
            case "Date":
              parsedValue = new Date(e);
              break;
            default:
              parsedValue = e;
          }
          setFormData({
            ...formData,
            typeSpecificFields: {
              ...formData.typeSpecificFields,
              [field.name]: parsedValue,
            },
          });
        }}
        otherStyles="mt-6"
        keyboardType={field.type === "Number" ? "numeric" : "default"}
      />
    );
  };

  return (
    <View>
      <FormField
        title="Title"
        value={formData.title}
        handleChangeText={(e) => setFormData({ ...formData, title: e })}
        otherStyles="mt-6"
      />
      <FormField
        title="Location"
        value={formData.location}
        handleChangeText={(e) => setFormData({ ...formData, location: e })}
        otherStyles="mt-6"
      />
      <FormField
        title="Price"
        value={formData.price?.toString()}
        handleChangeText={(e) =>
          setFormData({ ...formData, price: parseFloat(e) })
        }
        otherStyles="mt-6"
        keyboardType="numeric"
      />
      <FormField
        title="Description"
        value={formData.description}
        handleChangeText={(e) => setFormData({ ...formData, description: e })}
        otherStyles="mt-6"
      />
      {propertyType?.fields?.map(renderField)}

      {/* Image Upload Section */}
      <View className="mt-6">
        <Text className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">
          Property Images
        </Text>
        <TouchableOpacity
          onPress={pickImage}
          className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl flex-row items-center justify-center"
        >
          <Ionicons name="camera-outline" size={24} color="#3B82F6" />
          <Text className="ml-2 text-blue-600 dark:text-blue-400">
            Add Images
          </Text>
        </TouchableOpacity>

        {/* Image Preview */}
        {formData.images && formData.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {formData.images.map((image, index) => (
              <View key={index} className="mr-4 relative">
                <Image
                  source={{ uri: image.uri }}
                  className="w-24 h-24 rounded-xl"
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default PropertyForm;
