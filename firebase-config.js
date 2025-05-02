const firebaseConfig = {
    apiKey: "AIzaSyAWrG2vuqYbvQ5IwjMTml6HZuN9olNiIU8",
    authDomain: "chipchip-98dae.firebaseapp.com",
    databaseURL: "https://chipchip-98dae-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chipchip-98dae",
    storageBucket: "chipchip-98dae.firebasestorage.app",
    messagingSenderId: "913883228060",
    appId: "1:913883228060:web:ee8ce633b65aa6d04a0a59",
    measurementId: "G-MH3CNBHKJ5"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();