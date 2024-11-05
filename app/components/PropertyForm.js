import { View } from "react-native";
import React from "react";
import FormField from "./FormField";

const PropertyForm = ({ formData, setFormData, propertyType }) => {
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
    </View>
  );
};

export default PropertyForm;
