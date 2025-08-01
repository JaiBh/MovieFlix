import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const DeleteAccountButton = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const onPress = async () => {
    await user?.delete();
  };
  return (
    <>
      <TouchableOpacity
        className="bg-white-500 border-2 border-red-500 py-3 rounded-2xl px-6 w-full items-center"
        onPress={() => setOpen(true)}
      >
        <Text className="text-red-500 font-semibold">Delete Account</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text className="text-lg mb-4 text-center">
              Are you sure you want to delete your account?
            </Text>
            <View className="flex-row justify-between w-full">
              <Button title="Cancel" onPress={() => setOpen(false)} />
              <Button title="Delete" color="red" onPress={onPress} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default DeleteAccountButton;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    elevation: 5,
  },
});
