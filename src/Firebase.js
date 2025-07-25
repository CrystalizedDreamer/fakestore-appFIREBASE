// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMAT-N4tZ1M7xb6i64BDGOU7f-RwvvH40",
  authDomain: "ecommercetestapp-65f94.firebaseapp.com",
  projectId: "ecommercetestapp-65f94",
  storageBucket: "ecommercetestapp-65f94.firebasestorage.app",
  messagingSenderId: "440995863157",
  appId: "1:440995863157:web:bb236b54fcabdefa0ab63c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);