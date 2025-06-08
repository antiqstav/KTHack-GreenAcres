// firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import {
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBdtXeJeeT0ooE8yHsbMpUDVeXuDwkGAKk",
  authDomain: "agrilife-96ce0.firebaseapp.com",
  projectId: "agrilife-96ce0",
  storageBucket: "agrilife-96ce0.firebasestorage.app",
  messagingSenderId: "843694801338",
  appId: "1:843694801338:web:eaac054371ac115316dd83",
  measurementId: "G-Z9P0Q4RQ0H",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
populateTable();

// newCrop button logic
document.getElementById("newCrop").addEventListener("click", (e) => {
  e.preventDefault();
  const newCropForm = document.getElementById("newCropForm");

  if (!newCropForm.classList.contains("visible")) {
    newCropForm.classList.add("visible");
    overlay.classList.add("visible");
  }
});

// closing newCrop form if the close button got clicked
document.getElementById("close").addEventListener("click", (e) => {
  e.preventDefault();
  const newCropForm = document.getElementById("newCropForm");
  const overlay = document.getElementById("overlay");
  newCropForm.classList.remove("visible");
  overlay.classList.remove("visible");
});

// crop registering logic
document.getElementById("submit").addEventListener("click", async (e) => {
  e.preventDefault();
  const newCropForm = document.getElementById("newCropForm");
  const overlay = document.getElementById("overlay");
  const crop = document.getElementById("cropName").value;
  const rainfall = document.getElementById("rainfall").value;
  const acres = document.getElementById("acres").value;
  const loc = document.getElementById("geoloc").value;
  const entryName = document.getElementById("entryName").value;
  const lat = loc.split(",")[0];
  const lon = loc.split(",")[1];

  if (localStorage.getItem("updatedName") === null) {
    console.log("create");
    const q = collection(db, localStorage.getItem("docname"));

  const docRef = await addDoc(q, {
    acresPlanted: acres,
    cropName: crop,
    rainfall: rainfall,
    lat: lat,
    lon: lon,
    rainfall: rainfall,
    entryName: entryName
  });

  alert("Crop registered successfully.");
  console.log("Registered new crop with name (" + crop + ")");
  }
  else {

    console.log("update");

  const docRef = await setDoc(doc(db, localStorage.getItem("docname"), localStorage.getItem("updatedName")), {
    acresPlanted: acres,
    cropName: crop,
    rainfall: rainfall,
    lat: lat,
    lon: lon,
    rainfall: rainfall,
    entryName: entryName
  });

  alert("Crop updated successfully.");
  console.log("Updated crop with name (" + crop + ")");
  localStorage.removeItem("updatedName");
  }
  newCropForm.classList.remove("visible");
  overlay.classList.remove("visible");
  formyformform.reset();
  populateTable();
});

// logout button logic
document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Logged out successfully.");
  localStorage.removeItem("docname");
  window.location.replace("auth.html");
});

// populating the crops table
async function populateTable() {
  const cropsDiv = document.getElementById("crops");
  cropsDiv.innerHTML = "";

  document.getElementById("noCrops").style.display = "none";
  document.getElementById("noCropsDown").style.display = "none";
  document.getElementById("crops").style.display = "flex";

  try {
    const cropsCollection = collection(db, localStorage.getItem("docname")); // Reference to the Firestore collection
    const querySnapshot = await getDocs(cropsCollection); // Fetch all documents in the collection
    if (querySnapshot.size === 1) {
      document.getElementById("crops").style.display = "none";
      document.getElementById("noCropsDown").style.display = "flex";
      document.getElementById("noCrops").style.display = "flex";
      return;
    } else {
      document.getElementById("noCrops").style.display = "none";
      document.getElementById("noCropsDown").style.display = "none";
      document.getElementById("crops").style.display = "flex";
    }

    querySnapshot.forEach((doc) => {
      if (doc.id === "start") {
        return;
      }
      const cropData = doc.data();
      const entryName = cropData.entryName || "Unknown Entry";
      const cropName = cropData.cropName || "Unknown Crop";
      const acresPlanted = cropData.acresPlanted || "N/A";
      const rainfall = cropData.rainfall || "N/A";
      
      document.getElementById("pCrop").innerHTML = "Crop name: " + cropName;
      document.getElementById("pAcres").innerHTML = "Acres planted: " + acresPlanted;
      document.getElementById("pRain").innerHTML = "Current rainfall in area: " + rainfall;
      document.getElementById("pGeoloc").innerHTML = "Geolocation: " + cropData.lat + "," + cropData.lon;

      // Create a new div for each crop
      const cropBox = document.createElement("div");
      cropBox.classList.add("cropBox"); // Add a class for styling
      cropBox.setAttribute("id", doc.id);
      cropBox.innerHTML = `
        <h3 id="cropBox">${cropName}</h3>
        <p><strong>Location:</strong> ${entryName}</p>
        <button id="updateCrop">Update</button>
        <button id="deleteCrop">Delete</button>
      `;

      // Append the crop box to the parent div
      cropsDiv.appendChild(cropBox);
    });

    // Add event listeners for the buttons and stuff
    const updateCrop = document.querySelectorAll("updateCrop");
    const deleteCrop = document.querySelectorAll("deleteCrop");
    const cropBoxes = document.querySelectorAll(".cropBox");
    const cropDetails = document.getElementById("cropDetails");
    const closeDetails = document.getElementById("closeDetails");
    const overlay = document.getElementById("overlay");

    cropBoxes.forEach((cropBox, index) => {

      cropBox.addEventListener("click", (e) => {
        if (e.target === cropBox.querySelector("#updateCrop") || e.target === cropBox.querySelector("#deleteCrop")) {
          return;
        }
        e.preventDefault();
        cropDetails.classList.add("visible");
        localStorage.setItem("cropID", cropBox.id);
        overlay.classList.add("visible");
      });
      cropBox.querySelector("#updateCrop").addEventListener("click", (e) => {
        e.preventDefault();
        const newCropForm = document.getElementById("newCropForm");
        const overlay = document.getElementById("overlay");
        newCropForm.classList.add("visible");
        overlay.classList.add("visible");
      });
      cropBox.querySelector("#deleteCrop").addEventListener("click", async (e) => {
        e.preventDefault();
        const docRef = doc(db, localStorage.getItem("docname"), cropBox.id);
        await deleteDoc(docRef);
        alert("Crop deleted successfully.");
        console.log("Deleted crop with name (" + cropBox.id + ")");
        populateTable();
      });

    });
    closeDetails.addEventListener("click", (e) => {
      e.preventDefault();
      cropDetails.classList.remove("visible");
      overlay.classList.remove("visible");
      localStorage.removeItem("cropID");
    });
  } catch (error) {
    console.error("Error fetching crops:", error);
    cropsDiv.innerHTML = "<p>Error loading crops. Please try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  if (localStorage.getItem("saveFromResponse") === "true") {
    localStorage.removeItem("saveFromResponse");
    const cropName = localStorage.getItem("cropName");
    const rainfall = localStorage.getItem("rainfall");
    const lat = localStorage.getItem("latitude");
    const lon = localStorage.getItem("longitude");
    const geoloc = lat + "," + lon;
    localStorage.removeItem("cropName", cropName);
    localStorage.removeItem("rainfall", rainfall);

    newCropForm.classList.add("visible");
    overlay.classList.add("visible");
    document.getElementById("cropName").value = cropName;
    document.getElementById("rainfall").value = rainfall;
    document.getElementById("geoloc").value = geoloc;

    console.log(newCropForm);
  }
});