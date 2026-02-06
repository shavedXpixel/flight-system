import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyCT-7Ayuqe8qSZVjgYWVRJraHrr6PF4IcQ",
  authDomain: "flight-system-live.firebaseapp.com",
  projectId: "flight-system-live",
  storageBucket: "flight-system-live.firebasestorage.app",
  messagingSenderId: "185757595536",
  appId: "1:185757595536:web:c915bed591683f0a4d6515"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);