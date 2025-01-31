import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../config/firbase.config";

interface Post {
  title: string;
  photo: string;
  slug: string;
  description: string;
}

interface PostState {
  loading: boolean;
  posts: Post[];
  error: string | null;
}

const initialState: PostState = {
  loading: false,
  posts: [],
  error: null,
};

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (formData: Post, thunkAPI) => {
    try {
      await addDoc(collection(db, 'posts'), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid || 'unknown',
      });

      return formData; 
    } catch (error) {
      return thunkAPI.rejectWithValue('Something went wrong while adding the post.');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
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
      });
  },
});

export default postSlice.reducer;
