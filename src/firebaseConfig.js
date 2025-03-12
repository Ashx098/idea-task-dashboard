import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlZFw60obAigcnT4g2qRHWt5VSiK8GUcs",
  authDomain: "taskmanager-a77.firebaseapp.com",
  projectId: "taskmanager-a77",
  storageBucket: "taskmanager-a77.appspot.com",
  messagingSenderId: "266943540417",
  appId: "1:266943540417:web:0bd34ac71f319e8136f840"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Enforce session persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("🔒 Auth persistence enabled"))
  .catch((error) => console.error("Auth persistence error:", error));

console.log("🔥 Firebase Initialized:", app);
console.log("🗂 Firestore Instance:", db);
console.log("🔐 Firebase Auth:", auth);

export { db, auth, provider };
