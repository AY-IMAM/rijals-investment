import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuQsyHIn1JZ4cBvRqEGd73pbtfg28KIrY",
  authDomain: "rijals-investment.firebaseapp.com",
  projectId: "rijals-investment",
  storageBucket: "rijals-investment.firebasestorage.app",
  messagingSenderId: "904209859689",
  appId: "1:904209859689:web:babc56ecdd2e6c6fa6cef8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
