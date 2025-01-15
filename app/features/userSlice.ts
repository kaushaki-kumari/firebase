import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  password: string;
  confirmPassword: string;
  errorMessage: string | null;
  loading: boolean;
}

const initialState: UserState = {
  firstName: "",
  lastName: "",
  mobileNo: "",
  email: "",
  password: "",
  confirmPassword: "",
  errorMessage: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<Partial<UserState>>) => {
      state = { ...state, ...action.payload };
      return state;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    resetUserState: (state) => {
      return initialState;
    },
  },
});

export const { setUserData, setLoading, setErrorMessage ,resetUserState } = userSlice.actions;
export default userSlice.reducer;
