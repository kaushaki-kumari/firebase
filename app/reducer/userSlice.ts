import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { registerUser } from "./userActions";

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
      });
  },
});

export const { setErrorMessage } = userSlice.actions;
export default userSlice.reducer;
