import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../reducer/PostSlice";
import { AppDispatch } from "../store";
import PageStyles from "../styles/PageStyles";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const PostList = () => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status, errorMessage, lastDocId, hasMore, loadingMore } =
    useSelector((state: any) => state.posts);
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    dispatch(fetchPosts(null));
  }, [dispatch]);

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      dispatch(fetchPosts(lastDocId));
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };


  const renderItem = ({ item }: { item: any }) => {
    const postImageUrl =
      Platform.OS === "web"
        ? "https://mnlht.com/wp-content/uploads/2017/06/no_image_placeholder.png"
        : item.photo;
    const formattedDate = new Date(item.createdAt).toLocaleString();
    return (
      <View style={styles.postContainer}>
        <View style={styles.userContainer}>
          <FontAwesome
            name="user-circle"
            size={24}
            color="#555"
            style={styles.userIcon}
          />
          <Text style={styles.userName}>
            {/* {item.createdBy
              ? `${item.createdBy.firstName} ${item.createdBy.lastName}`
              : "Unknown User"}{" "} */}
            {formattedDate}
          </Text>
          
        </View>
        {/* {item.photo && (
          <Image source={{ uri: item.photo }} style={styles.image} />
        )} */}
        {postImageUrl && (
          <Image source={{ uri: postImageUrl }} style={styles.image} />
        )}
        <Text style={styles.title}>{item.title}</Text>
        <RenderHTML contentWidth={width} source={{ html: item.description }} />
        {item.taggedUsers && item.taggedUsers.length > 0 && (
          <Text style={styles.taggedUsers}>
            Tagged:{" "}
            {item.taggedUsers
              .map((user: any) => `@${user.firstName} ${user.lastName}`)
              .join(", ")}
          </Text>
        )}
        <TouchableOpacity onPress={() => toggleComments(item.id)}>
          <FontAwesome
            name="comment"
            size={20}
            color="#555"
            style={styles.commentIcon}
          />
        </TouchableOpacity>
        {expandedComments[item.id] && (
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Comments</Text>
            <Text style={styles.commentPlaceholder}>No comments yet.</Text>
          </View>
        )}
      </View>
    );
  };

  if (status === "loading" && !posts.length) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ffff" />
      </View>
    );
  }
  if (status === "failed") {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://www.stockvault.net/data/2019/08/28/268866/preview16.jpg",
      }}
      style={[PageStyles.background]}
    >
      <View style={styles.container}>
        <Text style={[PageStyles.title, PageStyles.titleClr]}>
          Your Posts 😝
        </Text>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}-${item.createdAt}`}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="large" color="#ffff" />
              </View>
            ) : null
          }
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  postContainer: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: Platform.OS === "web" ? "30%" : 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 5,
    borderRadius: 5,
  },
  // description: {
  //   marginTop: 5,
  //   fontSize: 14,
  //   color: "#555",
  // },
  taggedUsers: {
    // marginTop: 10,
    fontSize: 14,
    color: "#007AFF",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent:'space-between',
    // marginBottom: 10,
  },
  userIcon: {
    marginRight: 10,
  },
  userName: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  loadMoreContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  commentIcon: {
    marginTop: 10,
  },
  commentSection: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  commentPlaceholder: {
    fontSize: 14,
    color: "#777",
  },
});

export default PostList;
