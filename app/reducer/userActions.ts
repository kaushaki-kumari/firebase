import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  AuthError,
  AuthErrorCodes,
  UserCredential,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firbase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginUserPayload {
  email: string;
  password: string;
}

const handleFirebaseError = (error: AuthError) => {
  const errorMessages: Record<string, string> = {
    [AuthErrorCodes.WEAK_PASSWORD]: "Password should be at least 6 characters.",
    [AuthErrorCodes.EMAIL_EXISTS]: "The email address is already in use.",
    [AuthErrorCodes.INVALID_EMAIL]: "The email address is invalid.",
    [AuthErrorCodes.INVALID_PASSWORD]: "Invalid password.",
    [AuthErrorCodes.USER_DELETED]: "User not found.",
    "auth/invalid-credential":
      "Invalid credentials, please check your email or password",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
  };

  return errorMessages[error.code] || "An unexpected error occurred.";
};

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: RegisterUserPayload, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

      const userRef = doc(db, "users", userCredential.user.uid);
      const userDataToSave = {
        uid: userCredential.user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNo: userData.mobileNo,
        email: userData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, userDataToSave);

      return {
        uid: userCredential.user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNo: userData.mobileNo,
      };
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as AuthError;
        return rejectWithValue(handleFirebaseError(firebaseError));
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (credentials: LoginUserPayload, { rejectWithValue }) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         credentials.email,
//         credentials.password
//       );

//       const userRef = doc(db, "users", userCredential.user.uid);
//       const userDoc = await getDoc(userRef);

//       if (!userDoc.exists()) {
//         throw new Error("User data not found");
//       }

//       const userData = userDoc.data();
//       return {
//         uid: userCredential.user.uid,
//         email: userData.email,
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         mobileNo: userData.mobileNo,
//       };
//     } catch (error) {
//       if (error instanceof Error) {
//         const firebaseError = error as AuthError;
//         return rejectWithValue(handleFirebaseError(firebaseError));
//       }
//       return rejectWithValue("An unexpected error occurred.");
//     }
//   }
// );


export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginUserPayload, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const userRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User data not found");
      }

      const userData = userDoc.data();
      const userInfo = {
        uid: userCredential.user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNo: userData.mobileNo,
      };
      await AsyncStorage.setItem("user", JSON.stringify(userInfo));

      return userInfo;
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as AuthError;
        return rejectWithValue(handleFirebaseError(firebaseError));
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue("Failed to logout. Please try again.");
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "user/updateDetails",
  async (
    userData: {
      firstName: string;
      lastName: string;
      mobileNo: string;
      uid: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const userRef = doc(db, "users", userData.uid);
      const updatedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNo: userData.mobileNo,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userRef, updatedData, { merge: true });
      return {
        uid: userData.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNo: userData.mobileNo,
      };
    } catch (error) {
      return rejectWithValue("Failed to update user details.");
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return rejectWithValue("No authenticated user found.");
      }
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        return rejectWithValue("User data not found in Firestore.");
      }

      const userData = userDoc.data();
      return {
        uid: user.uid,
        email: user.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        mobileNo: userData.mobileNo || "",
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch user data.");
    }
  }
);
