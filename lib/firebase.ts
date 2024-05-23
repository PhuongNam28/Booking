import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB5XcuxRIwcji-A1EDbs9htta-zyA0ZJf4",
  authDomain: "chat-palmtree.firebaseapp.com",
  projectId: "chat-palmtree",
  storageBucket: "chat-palmtree.appspot.com",
  messagingSenderId: "635227917778",
  appId: "1:635227917778:web:c9ae363f2144fdb34d0c0b",
  measurementId: "G-YF1MYQ5MT5"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };