import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadUser, resetAuthState } from "../store/auth/authSlice";
import SplashScreen from "../components/SplashScreen";
import WelcomeScreen from "../components/WelcomeScreen";

const Index = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(loadUser()).unwrap();
        const user = await AsyncStorage.getItem("user");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (user) {
          router.push("/home");
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setIsLoading(false);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  // return <WelcomeScreen />;
  return null;
};

export default Index;
