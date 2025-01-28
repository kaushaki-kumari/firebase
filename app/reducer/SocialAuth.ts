import { 
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
  User as FirebaseUser,
  FacebookAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firbase.config";

interface UserData {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  mobileNo: string | null;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

const storeUserData = async (user: FirebaseUser): Promise<UserData> => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);  
  const now = new Date().toISOString();
  
  let userData: UserData;
  if (userDoc.exists()) {
    const existingData = userDoc.data() as UserData;
    userData = {
      ...existingData,
      email: user.email || existingData.email || "no email",
      providerId: user.providerData[0]?.providerId ?? existingData.providerId ?? "unknown",
      updatedAt: now
    };
  } else {
    userData = {
      uid: user.uid,
      email: user.email || "no email",
      firstName: user.displayName?.split(" ")[0] ?? null,
      lastName: user.displayName?.split(" ")[1] ?? null,
      mobileNo: user.phoneNumber ?? null,
      providerId: user.providerData[0]?.providerId ?? "unknown",
      createdAt: now,
      updatedAt: now
    };
  }

  await setDoc(userRef, userData, { merge: true });
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

export const handleTwitterLogin = async (): Promise<UserData> => {
  const provider = new TwitterAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error("No user data returned");

    console.log("Twitter login successful:", result.user);
    return await storeUserData(result.user);
  } catch (error) {
    console.error("Twitter login error:", error);
    throw error as Error;
  }
};

export const handleFacebookLogin = async (): Promise<UserData> => {
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error("No user data returned");

    console.log("Facebook login successful:", result.user);
    return await storeUserData(result.user);
  } catch (error) {
    console.error("Facebook login error:", error);
    throw error as Error;
  }
};