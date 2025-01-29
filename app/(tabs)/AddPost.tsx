import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../reducer/PostSlice";
import PageStyles from "../styles/PageStyles";
import { AppDispatch } from "../store";

const AddPost = () => {
  const webViewRef = useRef<WebView | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    photo: "",
    slug: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: any) => state.posts);

  const handleEditorMessage = (event: WebViewMessageEvent) => {
    setFormData({ ...formData, description: event.nativeEvent.data });
  };

  const resetEditor = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(
        `CKEDITOR.instances.editor.setData('');`
      );
    }
  };

  const handleAddPost = () => {
    setErrorMessage("");
    if (
      !formData.title ||
      !formData.photo ||
      !formData.slug ||
      !formData.description
    ) {
      setErrorMessage("All fields are required");
      return;
    }
    const generatedSlug = generateSlug(formData.title, formData.slug);
    const postData = { ...formData, slug: generatedSlug };

    dispatch(addPost(postData))
      .unwrap()
      .then(() => {
        setErrorMessage("");
        setFormData({ title: "", photo: "", slug: "", description: "" });
        resetEditor();
      })
      .catch((error: string) => setErrorMessage(error));
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
      <ScrollView style={styles.container}>
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
          <Text style={PageStyles.label}>Photo URL</Text>
          <TextInput
            style={PageStyles.input}
            placeholder="Photo URL"
            value={formData.photo}
            onChangeText={(text) => setFormData({ ...formData, photo: text })}
          />
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
        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Description</Text>
          <View style={styles.webviewContainer}>
            <WebView
              ref={webViewRef}
              originWhitelist={["*"]}
              source={{ html: editorHTML }}
              javaScriptEnabled
              onMessage={handleEditorMessage}
            />
          </View>
        </View>
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
      </ScrollView>
    </ImageBackground>
  );
};

const editorHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.ckeditor.com/4.16.2/standard/ckeditor.js"></script>
  </head>
  <body>
      <textarea id="editor"></textarea>
      <script>
          CKEDITOR.replace('editor');
          CKEDITOR.instances.editor.on('change', function() {
              window.ReactNativeWebView.postMessage(CKEDITOR.instances.editor.getData());
          });
      </script>
  </body>
  </html>
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  webviewContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default AddPost;