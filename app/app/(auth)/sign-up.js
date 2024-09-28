import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { images } from "../../constants";
// import { createUser } from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { register, resetAuthState } from "../../store/auth/authSlice";

const SignUp = () => {
  const dispatch = useDispatch();

  const { isLoading, isSuccess, isError } = useSelector((state) => state.auth);

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try {
      const data = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      dispatch(register(data));
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User created successfully",
      });
      router.push("/sign-in");
      dispatch(resetAuthState());
    }
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred during registration.",
      });
      dispatch(resetAuthState());
    }
  }, [isSuccess, isError, router]);

  return (
    <SafeAreaView className="bg-[#09092B] h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-5"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="w-full flex justify-center items-center">
            <Image
              source={images.logoSmall2}
              resizeMode="contain"
              className="w-[215px] h-[75px]"
            />
          </View>

          <Text className="text-2xl font-semibold text-white mt-7">
            Sign Up to Prime
          </Text>

          <FormField
            title="name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-6"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-normal">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
