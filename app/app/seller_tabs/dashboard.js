import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { getUserProperties } from "../../store/property/propertySlice";

// Mock data
const dashboardData = {
  summary: {
    totalProperties: 12,
    activeListings: 8,
    totalViews: 245,
    totalFavorites: 32,
  },
  propertyStats: {
    forRent: 5,
    forSale: 7,
    pendingApproval: 2,
    archived: 1,
  },
  recentActivity: {
    views: [28, 35, 42, 38, 40, 45, 48], // Last 7 days
    inquiries: [
      { id: 1, property: "Luxury Apartment", type: "Rent", date: "2024-03-15" },
      { id: 2, property: "Modern Villa", type: "Sale", date: "2024-03-14" },
      { id: 3, property: "Studio Apartment", type: "Rent", date: "2024-03-13" },
    ],
  },
};

const StatCard = ({ icon, label, value, color }) => (
  <View className="bg-white dark:bg-gray-800 rounded-xl p-4 flex-1 mx-2">
    <View
      className={`${color} w-8 h-8 rounded-full items-center justify-center mb-2`}
    >
      <Ionicons name={icon} size={20} color="white" />
    </View>
    <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
    <Text className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
      {value}
    </Text>
  </View>
);

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProperties());
  }, []);

  const { totalProperties } = useSelector((state) => state.property);
  return (
    <ScrollView className="bg-slate-300 dark:bg-[#09092B] flex-1">
      <View className="p-5">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Dashboard
        </Text>

        {/* Quick Stats */}
        <Text className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Overview
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          <StatCard
            icon="home"
            label="Total Properties"
            value={totalProperties}
            color="bg-blue-500"
          />
          <StatCard
            icon="eye"
            label="Total Views"
            value={dashboardData.summary.totalViews}
            color="bg-green-500"
          />
          <StatCard
            icon="heart"
            label="Total Favorites"
            value={dashboardData.summary.totalFavorites}
            color="bg-red-500"
          />
        </ScrollView>

        {/* Property Distribution */}
        <Text className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Property Distribution
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <Text className="text-gray-600 dark:text-gray-300">For Rent</Text>
            </View>
            <Text className="text-gray-800 dark:text-white font-semibold">
              {dashboardData.propertyStats.forRent}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-600 dark:text-gray-300">For Sale</Text>
            </View>
            <Text className="text-gray-800 dark:text-white font-semibold">
              {dashboardData.propertyStats.forSale}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
              <Text className="text-gray-600 dark:text-gray-300">Pending</Text>
            </View>
            <Text className="text-gray-800 dark:text-white font-semibold">
              {dashboardData.propertyStats.pendingApproval}
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <Text className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Recent Inquiries
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
          {dashboardData.recentActivity.inquiries.map((inquiry) => (
            <View
              key={inquiry.id}
              className="flex-row justify-between items-center mb-4 last:mb-0"
            >
              <View>
                <Text className="text-gray-800 dark:text-white font-medium">
                  {inquiry.property}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  For {inquiry.type}
                </Text>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(inquiry.date).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-4">
          <TouchableOpacity className="bg-[#FF8E01] rounded-xl p-4 flex-1">
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-semibold mt-2">Add Property</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-500 rounded-xl p-4 flex-1">
            <Ionicons name="stats-chart-outline" size={24} color="white" />
            <Text className="text-white font-semibold mt-2">
              View Analytics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
