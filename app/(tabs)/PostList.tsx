import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../reducer/PostSlice";
import { AppDispatch } from "../store";
import PageStyles from "../styles/PageStyles";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}
const PostList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status, errorMessage, lastDocId, hasMore, loadingMore } =
    useSelector((state: any) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts(null));
  }, [dispatch]);

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      dispatch(fetchPosts(lastDocId));
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const postImageUrl =
    Platform.OS === "web"
      ? "https://mnlht.com/wp-content/uploads/2017/06/no_image_placeholder.png"
      : item.photo;
    return (
      <View style={styles.postContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {/* {item.photo && (
          <Image source={{ uri: item.photo }} style={styles.image} />
        )} */}
         {postImageUrl && (
          <Image source={{ uri: postImageUrl }} style={styles.image} />
        )}
        <Text style={styles.description}>{item.description}</Text>
        {item.taggedUsers && item.taggedUsers.length > 0 && (
          <View>
            <Text style={styles.taggedUsersTitle}>Tagged Users:</Text>
            {item.taggedUsers.map((user: User, index: number) => (
              <View key={user.id || index}>
                <Text style={styles.userName}>
                  {user.firstName} {user.lastName}
                </Text>
              </View>
            ))}
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
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 5,
    borderRadius: 5,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
  taggedUsersTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
});

export default PostList;
