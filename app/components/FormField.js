import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  containerStyle,
  secureTextEntry,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Check if this is a password field
  const isPasswordField = title?.toLowerCase().includes("password");

  // Get the appropriate icon based on the field type
  const getFieldIcon = () => {
    const fieldType = title?.toLowerCase() || "";
    if (fieldType.includes("email")) return "mail-outline";
    if (fieldType.includes("phone")) return "call-outline";
    if (fieldType.includes("password")) return "lock-closed-outline";
    if (fieldType.includes("name")) return "person-outline";
    if (fieldType.includes("address")) return "location-outline";
    return "document-text-outline";
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-medium text-gray-800">{title}</Text>

      <View
        className={`w-full h-14 px-4 rounded-xl border ${containerStyle}
          ${
            isFocused
              ? "border-[#FF8E01]"
              : error
              ? "border-red-500"
              : "border-gray-200"
          } 
          flex flex-row items-center space-x-3 space-y-0`}
      >
        <Ionicons
          name={getFieldIcon()}
          size={20}
          color={isFocused ? "#FF8E01" : error ? "#EF4444" : "#6B7280"}
        />

        <TextInput
          className="flex-1 text-gray-800 font-medium text-base h-full"
          style={{
            textAlignVertical: "center",
            paddingVertical: 0, // Remove default padding
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={handleChangeText}
          secureTextEntry={isPasswordField && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isFocused ? "#FF8E01" : "#6B7280"}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View className="flex-row items-center space-x-1">
          <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
          <Text className="text-red-500 text-sm">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default FormField;
