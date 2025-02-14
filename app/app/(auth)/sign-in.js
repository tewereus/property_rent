import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import FormField from "../../components/FormField";
import Toast from "react-native-toast-message";
import { login, resetAuthState } from "../../store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const submit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please check the form for errors",
      });
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(login(form));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: error?.message || "An error occurred during login",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(isSuccess, user);
    if (isSuccess && user) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "logged in successfully",
      });
      if (user?.mode === "customer") {
        router.push("/home");
      } else if (user?.mode === "seller") {
        router.push("/seller_tabs");
      }
      dispatch(resetAuthState());
    }
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred during login.",
      });
      dispatch(resetAuthState());
    }
  }, [isSuccess, isError, dispatch, router]);

  return (
    <SafeAreaView className="bg-slate-100 flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="w-full flex justify-center px-6 my-5"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          {/* Logo */}
          <View className="w-full flex justify-center items-center mb-10">
            <Image
              source={images.logoSmall2}
              resizeMode="contain"
              className="w-[215px] h-[75px]"
            />
          </View>

          {/* Welcome Text */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-base">
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-5">
            <FormField
              title="Email Address"
              value={form.email}
              handleChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
              placeholder="example@email.com"
              error={errors.email}
              autoCapitalize="none"
              containerStyle="bg-white"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(value) => handleChange("password", value)}
              placeholder="Enter your password"
              otherStyles="mt-7"
              secureTextEntry
              error={errors.password}
              containerStyle="bg-white"
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity className="mt-4 mb-6">
            <Text className="text-[#FF8E01] text-right text-base font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-2"
            isLoading={isSubmitting}
            disabled={
              isSubmitting || Object.values(errors).some((error) => error)
            }
          />

          {/* Sign Up Link */}
          <View className="flex justify-center pt-8 flex-row gap-2">
            <Text className="text-base text-gray-600">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-base font-semibold text-[#FF8E01]"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
