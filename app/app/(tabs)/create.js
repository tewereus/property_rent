// import { View, Text } from "react-native";
// import React from "react";

// const Create = () => {
//   return (
//     <View className="bg-[#09092B] w-full min-h-screen">
//       <Text>Create</Text>
//     </View>
//   );
// };

// export default Create;

// src/App.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Button } from "react-native";
import { toggleTheme, loadThemeFromStorage } from "../../store/themeSlice";

const Create = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(loadThemeFromStorage());
  }, [dispatch]);

  return (
    <View
      className={`flex-1 justify-center items-center bg-white dark:bg-black`}
    >
      <Text className={`text-lg text-black dark:text-white`}>
        Current Theme: {mode}
      </Text>
      <Button title="Toggle Theme" onPress={() => dispatch(toggleTheme())} />
    </View>
  );
};

export default Create;
