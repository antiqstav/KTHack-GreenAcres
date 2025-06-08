// firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBdtXeJeeT0ooE8yHsbMpUDVeXuDwkGAKk",
  authDomain: "agrilife-96ce0.firebaseapp.com",
  projectId: "agrilife-96ce0",
  storageBucket: "agrilife-96ce0.firebasestorage.app",
  messagingSenderId: "843694801338",
  appId: "1:843694801338:web:eaac054371ac115316dd83",
  measurementId: "G-Z9P0Q4RQ0H"
};

// firebase configuration
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// form handling
const login = document.getElementById("login");
const register = document.getElementById("register");

// handling saved login
document.addEventListener("DOMContentLoaded", () => {
  const savedLogin = localStorage.getItem("docname");
  if (savedLogin !== null) {
    window.location.replace("console.html");
    return;
  }
});

// login logic
document.getElementById("login").addEventListener("submit", async (e) => {

  e.preventDefault();
  const username = login.username.value;
  const password = login.password.value;
  const docname = username + "-" + password;

  const q = await getDocs(collection(db, docname));

  if (!q.empty) {
    alert("Welcome, " + username + "!");
    window.location.replace("console.html");
    localStorage.setItem("docname", docname);
  }
  else {
    alert("Invalid username or password");
    console.log("No such user with username (" + username + ")");
  }

  login.reset();
});

// register logic
document.getElementById("register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = register.username.value;
  const password = register.password.value;
  if (password.length < 8) {
    alert("Password should be at least 8 characters long.");
    return;
  }

  const docname = username + "-" + password;

  const q = await getDocs(collection(db, docname));

  if (q.empty) {
    const docRef = doc(db, "crops", "sampleInput");
    const docSnap = await getDoc(docRef);
    await setDoc(doc(db, docname, "start"), docSnap.data());
    alert("Account created successfully. Please login to continue");
    window.location.replace("console.html");
    localStorage.setItem("docname", docname);
    console.log("Registered new user with username (" + username + ") and password (" + password + ")");
  }
  else {
    alert("Username already exists. Please choose another.");
    console.log("Attempted register with username (" + username + ").");
  }

  register.reset();
});