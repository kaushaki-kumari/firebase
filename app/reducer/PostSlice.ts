import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  collection,
  getDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { db, auth } from "../config/firbase.config";

interface Post {
  id?: string;
  title: string;
  photo: string;
  slug: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PostState {
  loading: boolean;
  posts: Post[];
  error: string | null;
  lastDocId: string | null;
  hasMore: boolean;
  loadingMore: boolean;
}

const initialState: PostState = {
  loading: false,
  posts: [],
  error: null,
  lastDocId: null,
  hasMore: true,
  loadingMore: false,
};
const POSTS_PER_PAGE = 10;

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (formData: Post, thunkAPI) => {
    try {
      await addDoc(collection(db, "posts"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid || "unknown",
      });

      return formData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Something went wrong while adding the post."
      );
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (lastDocId: string | null, thunkAPI) => {
    try {
      let postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );

      if (lastDocId) {
        const lastDoc = await getDoc(doc(getFirestore(), "posts", lastDocId));
        postsQuery = query(postsQuery, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(postsQuery);
      const posts: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt
          ? new Date(doc.data().createdAt.seconds * 1000).toISOString()
          : null,
        updatedAt: doc.data().updatedAt
          ? new Date(doc.data().updatedAt.seconds * 1000).toISOString()
          : null,
      })) as Post[];

      const newLastDocId =
        querySnapshot.docs.length > 0
          ? querySnapshot.docs[querySnapshot.docs.length - 1].id
          : null;

      return {
        posts,
        lastDocId: newLastDocId,
        hasMore: querySnapshot.docs.length === POSTS_PER_PAGE,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch posts.");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetPosts(state) {
      state.posts = [];
      state.lastDocId = null;
      state.hasMore = true;
      state.error = null;
      state.loadingMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.loadingMore = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [...state.posts, ...action.payload.posts];
        state.lastDocId = action.payload.lastDocId;
        state.hasMore = action.payload.hasMore;
        state.loadingMore = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.loadingMore = false;
      });
  },
});

export default postSlice.reducer;
