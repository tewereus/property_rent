import { View } from "react-native";
import FormField from "../../../components/FormField";

const SellApartment = ({ formData, setFormData }) => (
  <View>
    <FormField
      title="Apartment Name"
      value={formData.name}
      handleChangeText={(e) => setFormData({ ...formData, name: e })}
      otherStyles="mt-6"
    />
    <FormField
      title="Floor Number"
      value={formData.floor.toString()}
      handleChangeText={(e) => setFormData({ ...formData, floor: parseInt(e) })}
      otherStyles="mt-6"
      keyboardType="numeric"
    />
    {/* Add more fields specific to apartments here */}
  </View>
);

export default SellApartment;
