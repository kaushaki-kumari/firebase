import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AppDispatch, RootState } from "@/app/store";
import { RegisterScreenNavigationProp } from "@/app/types/types";
import { updateUserDetails } from "@/app/reducer/userActions";
import SuccessMessageModal from "./SuccessMessageModal";
import PageStyles from "@/app/styles/PageStyles";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const [ShowProfileUpdateModal, setShowProfileUpdateModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    mobileNo: user?.mobileNo || "",
  });
  const [error, setError] = useState<string>("");

  const handleCancel = () => {
    onClose();
    navigation.navigate("Profile");
  };

  const handleUpdate = async () => {
    if (!formData.firstName || !formData.lastName || !formData.mobileNo) {
      setError("All fields are required");
      return;
    }
    const mobileNoRegex = /^\d{10}$/;
    if (!mobileNoRegex.test(formData.mobileNo)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }
    try {
      const result = await dispatch(
        updateUserDetails({
          ...formData,
          uid: user!.uid,
        })
      ).unwrap();

      if (result) {
        onClose();
        setError("");
        setShowProfileUpdateModal(true);
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to update profile");
    }
  };

  const handleProfileModalClose = () => {
    setShowProfileUpdateModal(false);
    navigation.navigate("Profile");
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[PageStyles.title, PageStyles.titleClr]}>
              Update Profile
            </Text>
            <TextInput
              style={PageStyles.input}
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, firstName: text }))
              }
            />

            <TextInput
              style={[PageStyles.input, styles.inputTxt]}
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, lastName: text }))
              }
            />
            <TextInput
              style={[PageStyles.input, styles.inputTxt]}
              placeholder="Mobile Number"
              value={formData.mobileNo}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, mobileNo: text }))
              }
              keyboardType="phone-pad"
            />
            {error ? (
              <Text style={PageStyles.errorMessage}>{error}</Text>
            ) : null}
            <View style={PageStyles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={[PageStyles.buttonText, styles.buttonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[PageStyles.buttonText, styles.buttonText]}>
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SuccessMessageModal
        visible={ShowProfileUpdateModal}
        onClose={handleProfileModalClose}
        message="Profile updated successfully!"
        text="Back to Profile"
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#cbd5e0",
  },
  updateButton: {
    backgroundColor: "#3182ce",
  },
  buttonText: {
    textAlign: "center",
  },
  inputTxt: {
    marginTop: 10,
  },
});

export default ProfileModal;
