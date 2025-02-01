import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../reducer/userActions";
import { AppDispatch, RootState } from "../store/index";
import { UserDetails } from "../reducer/userSlice";
import { UserTag } from "../types/types";
import PageStyles from "../styles/PageStyles";

interface UserTaggingProps {
  taggedUsers: UserTag[];
  setTaggedUsers: React.Dispatch<React.SetStateAction<UserTag[]>>;
}

const TagUsers = ({ taggedUsers, setTaggedUsers }: UserTaggingProps) => {
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserDetails[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = users.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredUsers([]);
      setShowSuggestions(false);
    }
  }, [query, users]);

  const generateUniqueTagId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSelectUser = (selectedUser: UserDetails) => {
    if (!taggedUsers.some((user) => user.uid === selectedUser.uid)) {
      const taggedUser: UserTag = {
        tagId: generateUniqueTagId(),
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        uid: selectedUser.uid,
      };
      setTaggedUsers([...taggedUsers, taggedUser]);
    }
    setQuery("");
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagId: string) => {
    setTaggedUsers(taggedUsers.filter((user) => user.tagId !== tagId));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={PageStyles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Tag users..."
      />
      {showSuggestions && (
        <ScrollView
          style={styles.suggestionsList}
          keyboardShouldPersistTaps="handled"
        >
          {filteredUsers.map((item) => (
            <TouchableOpacity
              key={item.uid}
              style={styles.suggestionItem}
              onPress={() => handleSelectUser(item)}
            >
              <Text
                style={styles.itemText}
              >{`${item.firstName} ${item.lastName}`}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagList}
      >
        {taggedUsers.map((item) => (
          <TouchableOpacity
            key={item.tagId}
            style={styles.tag}
            onPress={() => handleRemoveTag(item.tagId)}
          >
            <Text style={styles.tagText}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.removeTag}>×</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  itemText: {
    fontSize: 16,
  },
  tagList: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  tag: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    margin: 4,
    flexDirection: "row",
    alignItems: "center",
    maxHeight: 40,
  },
  tagText: {
    color: "white",
    fontSize: 14,
    marginRight: 4,
  },
  removeTag: {
    color: "white",
    fontSize: 18,
    marginLeft: 4,
    marginTop: -2,
  },
});

export default TagUsers;
