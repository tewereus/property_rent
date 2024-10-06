import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../store/property/propertySlice";

const Explore = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const obj = {
      limit: parseInt(limit),
      // page: parseInt(page),
    };
    dispatch(getAllProperties(obj));
  }, [limit]);

  const onLimitChange = (e) => {
    if (e.key === "Enter") {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setLimit(value);
      } else {
        setLimit(10); // Set a default value if the input is not a valid number
      }
    }
  };

  const { user } = useSelector((state) => state.auth);
  const { properties } = useSelector((state) => state.property);

  const renderProperties = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
      <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text
        className="text-lg dark:text-slate-300"
        onPress={() => {
          console.log(user);
        }}
      >
        EXplore
      </Text>
      <View className="limit">
        <Text onPress={() => console.log(properties?.properties)}>Limit: </Text>
        <span>
          <input
            type="number"
            placeholder={`current limit: ${limit}`}
            onKeyDown={onLimitChange}
            min="1"
          />
        </span>
      </View>
      <FlatList
        data={properties?.properties}
        keyExtractor={(item) => item._id}
        renderItem={renderProperties}
      />
      {/* list properties based on date with latest at top */}
    </View>
  );
};

export default Explore;
