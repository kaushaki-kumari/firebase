import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error.message.includes("already exists")) {
    app = firebase.app(); 
  } else {
    throw error; 
  }
}

// connect= (accessToken , config)=> {
//   let one = firebase.app().database["fbApp"];
//   one.auth().currentUser.getToken()
//     .then(idToken => firebase.auth.GoogleAuthProvider.credential(idToken, accessToken))
//     .then(credential => {
//       let two = firebase.initializeApp(config, `[${config.apiKey}]`);
//       return two.auth().signInWithCredential(credential);
//     })
//     .catch(console.warn)
//     .then(console.info);
// }

// two.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
//   .then(function(result) {
//     return one.auth().signInWithCredential(result.credential);
//   });

export const auth = getAuth(app);
export const db = getFirestore(app);
