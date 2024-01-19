import firebase from 'firebase';


export const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBJbdQ9dXV3RnKZBCV-xzPwiiBCCrLH7lk",
    authDomain: "dev-rainbow-com.firebaseapp.com",
    databaseURL: "https://dev-rainbow-com-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dev-rainbow-com",
    storageBucket: "dev-rainbow-com.appspot.com",
    messagingSenderId: "256350538953",
    appId: "1:256350538953:web:49bfe50d14a74a0c661118",
    measurementId: "G-6DLHBVJBD0"
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);    
 }

  return firebase;
}
