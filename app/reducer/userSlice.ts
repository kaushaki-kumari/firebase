import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { registerUser } from "./userActions";

const initialState = {
  firstName: "",
  lastName: "",
  mobileNo: "",
  email: "",
  password: "",
  confirmPassword: "",
  image: null as string | null,
  errorMessage: null as string | null,
  loading: false,
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<Partial<typeof initialState>>
    ) => {
      return { ...state, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    resetUserState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.loading = false;
        state.errorMessage = null;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.mobileNo = action.payload.mobileNo;
        state.email = action.payload.email;
        state.image = action.payload.profilePhoto;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { setUserData, setLoading, setErrorMessage, resetUserState } =
  userSlice.actions;
export default userSlice.reducer;
