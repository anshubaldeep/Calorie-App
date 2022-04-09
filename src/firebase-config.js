// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBviJySTNMbUYQqSP_UjF22YBfWvgRhjRA",
  authDomain: "toptal-calories-apps.firebaseapp.com",
  projectId: "toptal-calories-apps",
  storageBucket: "toptal-calories-apps.appspot.com",
  messagingSenderId: "395947404591",
  appId: "1:395947404591:web:9c7101dceeac29cd7905da",
  measurementId: "G-EW96SJ07MH",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const analytics = getAnalytics(app)

export { db }
