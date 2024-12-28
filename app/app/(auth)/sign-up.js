import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { register, resetAuthState } from "../../store/auth/authSlice";
import {
  getAllRegions,
  getAllSubRegions,
  getAllLocations,
} from "../../store/address/addressSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
  }, []);
  const { regions, subregions, locations } = useSelector(
    (state) => state.address
  );
  const [isSubmitting, setSubmitting] = useState(false);
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // address: "",
    phone: "",
    region: "",
    subregion: "",
    location: "",
  });

  // useEffect(() => {
  //   if (form.country) {
  //     const countryRegions = regions.filter(
  //       (region) => region.country?._id === form.country
  //     );
  //     setFilteredRegions(countryRegions);
  //     // Reset dependent fields
  //     setForm((prev) => ({
  //       ...prev,
  //       region: "",
  //       subRegion: "",
  //       location: "",
  //     }));
  //     setFilteredSubRegions([]);
  //     setFilteredLocations([]);
  //   }
  // }, [form.country, regions]);

  // Handle region selection
  useEffect(() => {
    if (form.region) {
      const regionSubRegions = subregions.filter(
        (subRegion) => subRegion.region_id?._id === form.region
      );
      setFilteredSubRegions(regionSubRegions);
      // Reset dependent fields
      setForm((prev) => ({
        ...prev,
        subRegion: "",
        location: "",
      }));
      setFilteredLocations([]);
    }
  }, [form.region, subregions]);

  // Handle subregion selection
  useEffect(() => {
    if (form.subregion) {
      // console.log("subRegionLocations");
      const subRegionLocations = locations.filter(
        (location) => location?.subregion_id?._id === form.subregion
      );
      console.log(subRegionLocations);
      setFilteredLocations(subRegionLocations);
      setForm((prev) => ({
        ...prev,
        location: "",
      }));
    }
  }, [form.subregion, form.region, locations]);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    region: "",
    subregion: "",
    location: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      phone: "",
      region: "",
      subregion: "",
      location: "",
    };

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(form.name)) {
      newErrors.name = "Name can only contain letters and spaces";
      isValid = false;
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    if (!form.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[\d\s-]{9,}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Address validation
    // if (!form.address.trim()) {
    //   newErrors.address = "Address is required";
    //   isValid = false;
    // } else if (form.address.trim().length < 5) {
    //   newErrors.address = "Address must be at least 5 characters";
    //   isValid = false;
    // }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    } else if (!/(?=.*[!@#$%^&*])/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one special character";
      isValid = false;
    }

    // Confirm Password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);

    // Find the first error to show in toast
    if (!isValid) {
      const firstError = Object.entries(newErrors).find(
        ([_, value]) => value !== ""
      );
      if (firstError) {
        Toast.show({
          type: "error",
          text1: `${
            firstError[0].charAt(0).toUpperCase() + firstError[0].slice(1)
          } Error`,
          text2: firstError[1],
        });
      }
    }

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        name: form.name.trim(),
        email: form.email.toLowerCase(),
        password: form.password,
        address: {
          region: form.region,
          subregion: form.subregion,
          location: form.location,
        },
        phone: form.phone.trim(),
      };
      console.log(data);
      await dispatch(register(data)).unwrap();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration Error",
        text2: error?.message || "An error occurred during registration",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess && message === "Registered Successfully") {
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
            title="Full Name"
            value={form.name}
            handleChangeText={(value) => handleChange("name", value)}
            otherStyles="mt-6"
            placeholder="name"
            error={errors.name}
            autoCapitalize="words"
          />

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
            title="Phone"
            value={form.phone}
            handleChangeText={(value) => handleChange("phone", value)}
            placeholder="phone"
            otherStyles="mt-6"
            keyboardType="phone-pad"
            error={errors.phone}
          />

          {/* <FormField
            title="Address"
            value={form.address}
            handleChangeText={(value) => handleChange("address", value)}
            placeholder="address"
            otherStyles="mt-6"
            error={errors.address}
          /> */}

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(value) => handleChange("password", value)}
            placeholder="password"
            otherStyles="mt-7"
            secureTextEntry
            error={errors.password}
          />

          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(value) => handleChange("confirmPassword", value)}
            placeholder="confirm password"
            otherStyles="mt-7"
            secureTextEntry
            error={errors.confirmPassword}
          />
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              onClick={() => console.log(form.region)}
            >
              Region *
            </label>
            <select
              name="region"
              value={form.region}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.region
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              required
              // disabled={!form.country}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.region_name}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="mt-1 text-sm text-red-500">{errors.region}</p>
            )}
          </div>

          {/* Sub Region */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              onClick={() => console.log(form.subregion)}
            >
              Sub Region *
            </label>
            <select
              name="subregion"
              value={form.subregion}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.subregion
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              required
              disabled={!form.region}
            >
              <option value="">Select Sub Region</option>
              {filteredSubRegions.map((subRegion) => (
                <option key={subRegion._id} value={subRegion._id}>
                  {subRegion.subregion_name}
                </option>
              ))}
            </select>
            {errors.subregion && (
              <p className="mt-1 text-sm text-red-500">{errors.subRegion}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              onClick={() => console.log(form.location)}
            >
              Location *
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.location
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              required
              disabled={!form.subregion}
            >
              <option value="">Select Location</option>
              {filteredLocations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.location}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            disabled={
              isSubmitting || Object.values(errors).some((error) => error)
            }
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
