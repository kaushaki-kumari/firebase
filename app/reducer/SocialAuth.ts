import { 
    GoogleAuthProvider,
    signInWithPopup,
    User as FirebaseUser,
    TwitterAuthProvider,
  } from "firebase/auth";
  import { doc, setDoc } from "firebase/firestore";
  import {  auth, db } from "../config/firbase.config";
  
  interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    providerId: string;
    lastLogin: string;
  }
  
  const storeUserData = async (user: FirebaseUser): Promise<UserData> => {
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,  
      providerId: user.providerData[0]?.providerId ?? 'unknown',
      lastLogin: new Date().toISOString()
    };
  
    await setDoc(doc(db, "users", user.uid), userData, { merge: true });
    return userData;
  };
  
//   export const handleGoogleLogin = async ()=> {
//     const provider = new GoogleAuthProvider();
// //     signInWithPopup(auth, provider)
// //     .then((re)=>{
// //       console.log(re);
// //   })
// //   .catch((err) => alert(err.message))
// // }
//     provider.setCustomParameters({
//       prompt: 'select_account'
//     });
  
//     const result: UserCredential = await signInWithPopup(auth, provider);
//     return storeUserData(result.user);
//   };
  
export const handleGoogleLogin = async (): Promise<UserData> => {
  try {
    if (!auth) throw new Error('Auth instance not initialized');
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
  

    const result = await signInWithPopup(auth, provider);
    if (!result.user) throw new Error('No user data returned');
    const user = result.user;
    console.log("Google login successfulsss:", user);
    return await storeUserData(result.user);
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

export const handleTwitterLogin = async () => {
  const provider = new TwitterAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User Info:", user);
    return storeUserData(user);
  } catch (error) {
    console.error("Twitter login error:", error);
  }
};