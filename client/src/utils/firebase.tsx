
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getDatabase} from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpDR1fm-Pvzo8K9jgGftjAQwiitK1IqjE",
  authDomain: "budgeteer-bb6a5.firebaseapp.com",
  databaseURL: "https://budgeteer-bb6a5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "budgeteer-bb6a5",
  storageBucket: "budgeteer-bb6a5.appspot.com",
  messagingSenderId: "897189052924",
  appId: "1:897189052924:web:33c4a9123050c0c6a27279",
  measurementId: "G-LQ4447PXDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db= getDatabase(app);
export default app;