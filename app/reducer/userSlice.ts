import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { registerUser } from "./userActions";

type UserState = Record<string, any>;

const initialState: UserState = {};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    resetUserState: () => {
      return {}; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserState>) => {
        return { ...state, ...action.payload, status: "succeeded", loading: false, errorMessage: null };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { setUserData, setLoading, setErrorMessage, resetUserState } = userSlice.actions;
export default userSlice.reducer;
