import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserDetails,
  fetchUserData,
  fetchUsers,
} from "./userActions";

export interface UserDetails {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  mobileNo: string | null;
}

interface UserState {
  users: UserDetails[];
  user: UserDetails | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  errorMessage: string | null;
}

const initialState: UserState = {
  users: [],
  user: null,
  status: "idle",
  loading: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDetails | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    clearErrors: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        if (state.user) {
          state.user.firstName = action.payload.firstName;
          state.user.lastName = action.payload.lastName;
          state.user.mobileNo = action.payload.mobileNo;
          state.status = "succeeded";
          state.loading = false;
          state.errorMessage = null;
        }
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.errorMessage = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = "succeeded";
        state.errorMessage = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.payload as string;
      });
  },
});

export const { setUser, setErrorMessage, clearErrors, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
