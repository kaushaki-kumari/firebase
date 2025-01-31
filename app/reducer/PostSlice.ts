import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../config/firbase.config";

interface Post {
  title: string;
  photo: string;
  slug: string;
  description: string;
  updatedAt: string;
  id: string;
}

interface PostState {
  loading: boolean;
  posts: Post[];
  error: string | null;
  lastVisible: any;
}

const initialState: PostState = {
  loading: false,
  posts: [],
  error: null,
  lastVisible: null,
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

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        photo: data.photo,
        slug: data.slug,
        description: data.description,
        updatedAt: data.updatedAt?.toDate().toISOString(), 
        taggedUsers: data.taggedUsers || [],
      };
    });
    return posts;
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
      })
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; 
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default postSlice.reducer;
