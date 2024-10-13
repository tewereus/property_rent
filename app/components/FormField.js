import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-medium dark:text-gray-100">{title}</Text>

      <View className="w-full h-16 px-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 flex flex-row items-center">
        <TextInput
          className="flex-1 text-gray-800 dark:text-white font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0" // Placeholder color for light mode
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
