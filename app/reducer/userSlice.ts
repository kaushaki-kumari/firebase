import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser } from "./userActions";

interface UserDetails {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
}

interface UserState {
  user: UserDetails | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  errorMessage: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  loading: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    clearErrors: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserDetails>) => {
          state.user = action.payload;
          state.status = "succeeded";
          state.loading = false;
          state.errorMessage = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserDetails>) => {
          state.user = action.payload;
          state.status = "succeeded";
          state.loading = false;
          state.errorMessage = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.loading = false;
        state.errorMessage = null;
      });
  },
});

export const { setErrorMessage, clearErrors } = userSlice.actions;
export default userSlice.reducer;