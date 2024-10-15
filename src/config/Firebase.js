import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRIp-2mkUFvrSMmE9IHKZ3rHkYqaQ0_IQ",
  authDomain: "real-time-messaging-7150f.firebaseapp.com",
  projectId: "real-time-messaging-7150f",
  storageBucket: "real-time-messaging-7150f.appspot.com",
  messagingSenderId: "767149369242",
  appId: "1:767149369242:web:5765f56b6c99f16009bc23",
  measurementId: "G-0EBS60X7L3",
};

const app = initializeApp(firebaseConfig);
export const googleAuth = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
