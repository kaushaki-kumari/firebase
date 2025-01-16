import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, AuthError, AuthErrorCodes, UserCredential } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firbase.config"; 

interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: RegisterUserPayload, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNo: userData.mobileNo,
        email: userData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
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
        const errorMessages: Record<string, string> = {
          [AuthErrorCodes.WEAK_PASSWORD]: "Password should be at least 6 characters.",
          [AuthErrorCodes.EMAIL_EXISTS]: "The email address is already in use.",
          [AuthErrorCodes.INVALID_EMAIL]: "The email address is invalid.",
        };

        return rejectWithValue(
          errorMessages[firebaseError.code] || "An error occurred, please try again."
        );
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);
