import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import PageStyles from "../styles/PageStyles";
import { TextInput } from "react-native-gesture-handler";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const AddPost = () => {
  const [plainText, setPlainText] = useState("");
  const [editorState, setEditorState] = useState('');
  const richText = useRef(null);

  const handleAddPost = () => {
    console.log("Add Post button pressed");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://www.stockvault.net/data/2019/08/28/268866/preview16.jpg",
      }}
      style={PageStyles.background}
    >
      <View style={styles.container}>
        <Text style={PageStyles.title}>Create a New Post</Text>

        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Title</Text>
          <TextInput style={PageStyles.input} placeholder="Title" />
        </View>

        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Photo URL</Text>
          <TextInput style={PageStyles.input} placeholder="Photo URL" />
        </View>

        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Slug</Text>
          <TextInput style={PageStyles.input} placeholder="Slug" />
        </View>

        <View style={PageStyles.inputContainer}>
          <Text style={PageStyles.label}>Description</Text>
          <RichEditor
            ref={richText}
            style={styles.richEditor}
            placeholder="Write your description here..."
            onChange={setEditorState}
          />
          <RichToolbar editor={richText} />
        </View>

        <TouchableOpacity
          style={[PageStyles.button, styles.button]}
          onPress={handleAddPost}
        >
          <Text style={PageStyles.buttonText}>Add Post</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
  },
  richEditor: {
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 200,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    maxWidth: 200,
    marginTop: 20,
  },
});
export default AddPost;

// import React from "react";
// import { Text, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView } from "react-native";
// import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

// const handleHead = ({ tintColor }: { tintColor: string }) => <Text style={{ color: tintColor }}>H1</Text>;

// const AddPost = () => {
//   const richText = React.useRef<RichEditor | null>(null);

//   return (
//     <SafeAreaView>
//       <ScrollView>
//         <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={{ flex: 1 }}>
//           <Text>Description:</Text>
//           <RichEditor
//             ref={richText} 
//             onChange={descriptionText => {
//               console.log("descriptionText:", descriptionText);
//             }}
//           />
//         </KeyboardAvoidingView>
//       </ScrollView>

//       <RichToolbar
//         editor={richText}
//         actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1]}
//         iconMap={{ [actions.heading1]: handleHead }}
//       />
//     </SafeAreaView>
//   );
// };

// export default AddPost;

