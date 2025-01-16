import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { registerUser } from "./userActions";

type UserState = Record<string, any>;

const initialState: UserState = {};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {   
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
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

export const {  setErrorMessage } = userSlice.actions;
export default userSlice.reducer;
