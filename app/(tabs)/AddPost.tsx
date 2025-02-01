import React, { useRef, useState, createRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import { addPost } from "../reducer/PostSlice";
import PageStyles from "../styles/PageStyles";
import { AppDispatch } from "../store";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { RegisterScreenNavigationProp, UserTag } from "../types/types";
import Toast from "toastify-react-native";
import TagUsers from "../components/TagUsers";

const AddPost = () => {
  const _editor = createRef<QuillEditor>();
  const [formData, setFormData] = useState({
    title: "",
    photo: "",
    slug: "",
  });
  const [description, setDescription] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<UserTag[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { loading } = useSelector((state: any) => state.posts);

  const resetEditor = () => {
    if (_editor.current) {
      _editor.current.setContents([{ insert: "\n" }]);
    }
    setDescription("");
  };

  const pickImage = async (source: "camera" | "gallery") => {
    let result;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera access is required.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }
    if (result.assets && result.assets.length > 0) {
      setFormData({ ...formData, photo: result.assets[0].uri });
      setErrorMessage("");
    } else {
      setErrorMessage("No image selected. Please select an image.");
    }
  };

  const handleAddPost = () => {
    setErrorMessage("");
    if (!formData.title || !formData.photo || !formData.slug || !description) {
      setErrorMessage("All fields are required");
      return;
    }
    const generatedSlug = generateSlug(formData.title, formData.slug);
    const postData = {
      ...formData,
      slug: generatedSlug,
      description,
      taggedUsers: taggedUsers,
      updatedAt: new Date().toISOString(),
    };

    dispatch(addPost(postData))
      .unwrap()
      .then(() => {
        setErrorMessage("");
        setFormData({ title: "", photo: "", slug: "" });
        setDescription("");
        setTaggedUsers([]);
        navigation.navigate("home");
        Toast.info("Post added successfully!");
      })
      .catch((error: string) => setErrorMessage(error));
    resetEditor();
  };

  const generateSlug = (title: string, slugFromFormData: string) => {
    const slugBase = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const uniqueId = Date.now();
    return `${slugBase}-${uniqueId}-${slugFromFormData}`;
  };

  return (
    <ImageBackground
      source={{
        uri: "https://www.stockvault.net/data/2019/08/28/268866/preview16.jpg",
      }}
      style={PageStyles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[PageStyles.title, PageStyles.titleClr]}>
          Create New Post
        </Text>
        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Title</Text>
          <TextInput
            style={PageStyles.input}
            placeholder="Title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>
        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Profile image</Text>
          <View style={PageStyles.imagePickerContainer}>
            <TouchableOpacity
              onPress={() => pickImage("gallery")}
              style={PageStyles.imageContent}
            >
              <Ionicons name="image" size={32} color="#3182ce" />
              <Text style={PageStyles.imagePickerText}>From Gallery</Text>
            </TouchableOpacity>
            {Platform.OS !== "web" && (
              <TouchableOpacity
                onPress={() => pickImage("camera")}
                style={PageStyles.imageContent}
              >
                <Ionicons name="camera" size={32} color="#3182ce" />
                <Text style={PageStyles.imagePickerText}>From Camera</Text>
              </TouchableOpacity>
            )}
          </View>
          {formData.photo ? (
            <Image
              source={{ uri: formData.photo }}
              style={styles.imagePreview}
            />
          ) : null}
        </View>
        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Slug</Text>
          <TextInput
            style={PageStyles.input}
            placeholder="Slug"
            value={formData.slug}
            onChangeText={(text) => setFormData({ ...formData, slug: text })}
          />
        </View>
        <TagUsers
          taggedUsers={taggedUsers}
          setTaggedUsers={setTaggedUsers}
        />
        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Description</Text>
          <View style={styles.webviewContainer}>
            <QuillEditor
              webview={{
                nestedScrollEnabled: true,
              }}
              ref={_editor}
              onHtmlChange={({ html }) => setDescription(html)}
              quill={{
                placeholder: "this is placeholder",
                modules: {
                  toolbar: false,
                },
                theme: "snow",
              }}
            />
            <QuillToolbar
              editor={_editor}
              theme="light"
              options={[
                ["bold", "italic", "underline"],
                [{ header: 1 }, { header: 2 }],
                [{ align: [] }],
                ["image", "clock"],
              ]}
            />
          </View>
        </View>
        <View style={PageStyles.inputContainer}>
          <TouchableOpacity
            style={[PageStyles.button, loading && PageStyles.buttonDisabled]}
            onPress={handleAddPost}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={PageStyles.buttonText}>Add Post</Text>
            )}
          </TouchableOpacity>
          {errorMessage ? (
            <Text style={PageStyles.errorMessage}>{errorMessage}</Text>
          ) : null}
        </View>
       
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  webviewContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
    color: "black",
  },
  editor: {
    flex: 1,
    padding: 0,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "pink",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default AddPost;
