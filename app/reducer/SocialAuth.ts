import {
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
  User as FirebaseUser,
  FacebookAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firbase.config";

interface UserData {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  mobileNo?: string | null;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

const storeUserData = async (user: FirebaseUser): Promise<UserData> => {
  const userData: UserData = {
    uid: user.uid,
    email: user.email || "no emial",
    firstName: user.displayName?.split(" ")[0] ?? null,
    lastName: user.displayName?.split(" ")[1] ?? null,
    mobileNo: user.phoneNumber ?? null,
    providerId: user.providerData[0]?.providerId ?? "unknown",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", user.uid), userData, { merge: true });

  return userData;
};

export const handleGoogleLogin = async (): Promise<UserData> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error("No user data returned");

    console.log("Google login successful:", result.user);
    return await storeUserData(result.user);
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

export const handleTwitterLogin = async (): Promise<UserData | void> => {
  const provider = new TwitterAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error("No user data returned");

    console.log("Twitter login successful:", result.user);
    return await storeUserData(result.user);
  } catch (error) {
    console.error("Twitter login error:", error);
  }
};

export const handleFacebookLogin = async (): Promise<UserData | void> => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error("No user data returned");

    console.log("Facebook login successful:", result.user);
    return await storeUserData(result.user);
  } catch (error) {
    console.error("Facebook login error:", error);
  }
};
