import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { AppDispatch } from "../store/index";
import {
  fetchUserData,
  logoutUser,
  updateUserDetails,
} from "../reducer/userActions";
import PageStyles from "../styles/PageStyles";
import { RegisterScreenNavigationProp } from "../types/types";

function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    mobileNo: user?.mobileNo || "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        mobileNo: user.mobileNo || "",
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate("login");
  };

  const handleUpdate = async () => {
    if (!formData.firstName || !formData.lastName || !formData.mobileNo) {
      setError("All fields are required");
      return;
    }
    const mobileNoRegex = /^\d{10}$/;
    if (!mobileNoRegex.test(formData.mobileNo)) {
      setError("Mobile number must be 10 digits");
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
        setError("");
        setIsEditing(false);
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to update profile");
    }
  };

  if (!user) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground
      source={{
        uri: "https://www.stockvault.net/data/2019/08/28/268866/preview16.jpg",
      }}
      style={PageStyles.background}
    >
      <ScrollView style={styles.container}>
        <Text style={[PageStyles.title, PageStyles.titleClr]}>My Profile</Text>
        <View style={styles.profileInfo}>
          <Image
            source={{
              uri: "https://png.pngtree.com/png-clipart/20240521/original/pngtree-a-cute-panda-png-image_15146092.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user.firstName || "User"}</Text>
        </View>
        <View style={PageStyles.inputContainer}>
          <Text style={[PageStyles.label, styles.fieldInput]}>First Name</Text>
          <TextInput
            style={PageStyles.input}
            value={formData.firstName}
            editable={isEditing}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, firstName: text }))
            }
          />
        </View>
        <View style={PageStyles.inputContainer}>
          <Text style={[PageStyles.label, styles.fieldInput]}>Last Name</Text>
          <TextInput
            style={PageStyles.input}
            value={formData.lastName}
            editable={isEditing}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, lastName: text }))
            }
          />
        </View>
        <View style={PageStyles.inputContainer}>
          <Text style={[PageStyles.label, styles.fieldInput]}>Email</Text>
          <TextInput
            style={PageStyles.input}
            value={user.email || "Not Provided"}
            editable={false}
          />
        </View>
        <View style={PageStyles.inputContainer}>
          <Text style={[PageStyles.label, styles.fieldInput]}>
            Mobile Number
          </Text>
          <TextInput
            style={PageStyles.input}
            value={formData.mobileNo || ""}
            editable={isEditing}
            maxLength={10}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, mobileNo: text }))
            }
            keyboardType="phone-pad"
          />
          {error ? <Text style={PageStyles.errorMessage}>{error}</Text> : null}
        </View>

        <View style={[PageStyles.inputContainer, styles.viewButton]}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={PageStyles.buttonText}>Logout</Text>
          </TouchableOpacity>
          {isEditing ? (
            <TouchableOpacity
              style={[styles.button, loading && PageStyles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={PageStyles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={PageStyles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default Profile;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 50 : 80,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "cursive",
  },
  button: {
    backgroundColor: "#3182ce",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    cursor: "pointer",
  },
  viewButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    marginTop: 20,
  },
  fieldInput: {
    marginTop: 10,
    fontSize: 15,
    // color: "#fff",
  },
});
