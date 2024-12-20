import { Dimensions, Image, ScrollView, Text, View } from "react-native";
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

  const { user, isSuccess, isError } = useSelector((state) => state.auth);

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
      await dispatch(login(form)).unwrap();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "An error occurred during login",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "logged in successfully",
      });
      if (user?.mode === "customer") {
        console.log("customer");
        router.push("/home");
      } else if (user?.mode === "seller") {
        console.log("seller");
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
      dispatch(resetAuthState()); // Dispatch resetAuthState on error
    }
  }, [isSuccess, isError, dispatch, router]);

  return (
    <SafeAreaView className="bg-[#09092B] h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="w-full flex justify-center items-center">
            <Image
              source={images.logoSmall2}
              resizeMode="contain"
              className="w-[215px] h-[120px]"
            />
          </View>

          <Text className="text-2xl font-semibold text-white mt-10">
            Log in to Prime
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(value) => handleChange("email", value)}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="email address"
            error={errors.email}
            autoCapitalize="none"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(value) => handleChange("password", value)}
            otherStyles="mt-7"
            placeholder="password"
            secureTextEntry
            error={errors.password}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            disabled={
              isSubmitting || Object.values(errors).some((error) => error)
            }
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-normal">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
