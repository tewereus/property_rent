import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
import { useColorScheme } from "nativewind";

const TabIcon = ({ icon, color, name, focused }) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-semibold" : "font-normal"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          // Dynamic colors based on theme
          tabBarActiveTintColor: isDark ? "#FFA001" : "#FFA001",
          tabBarInactiveTintColor: isDark ? "#CDCDE0" : "#94A3B8",
          tabBarStyle: {
            backgroundColor: isDark ? "#09092B" : "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: isDark ? "#232533" : "#E2E8F0",
            height: 84,
            elevation: isDark ? 0 : 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: isDark ? 0 : 0.1,
            shadowRadius: 3,
          },
          tabBarItemStyle: {
            padding: 5,
          },
          // Header styles based on theme
          headerStyle: {
            backgroundColor: isDark ? "#09092B" : "#FFFFFF",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#000000",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.logout}
                color={color}
                name="Explore"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
