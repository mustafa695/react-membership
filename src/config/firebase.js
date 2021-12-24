import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxGspwEefxQdiRpi4Xv1V1b_6Rkf1WxhE",
  authDomain: "membership-fdfcf.firebaseapp.com",
  projectId: "membership-fdfcf",
  storageBucket: "membership-fdfcf.appspot.com",
  messagingSenderId: "508880331912",
  appId: "1:508880331912:web:eab19a627db03e9e646b3d",
  measurementId: "G-9FXZMVDV9W",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, auth };
