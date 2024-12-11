import { View, Text, Image } from "react-native";
import React, { memo } from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";
import { useColorScheme } from "nativewind";

const TabIcon = memo(({ icon, color, name, focused }) => {
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
});

const SellerTabs = memo(() => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
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
        headerStyle: {
          backgroundColor: isDark ? "#09092B" : "#FFFFFF",
        },
        headerTintColor: isDark ? "#FFFFFF" : "#000000",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.menu}
              color={color}
              name="Dashboard"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="listing"
        options={{
          title: "Listing",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.upload}
              color={color}
              name="Listing"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
              color={color}
              name="Create"
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
  );
});

export default SellerTabs;
