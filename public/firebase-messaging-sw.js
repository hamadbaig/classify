importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyBz0O1J_PWkGpMyIB0m_Hjwiwf3jFBuLPU",
  authDomain: "classify-519cb.firebaseapp.com",
  projectId: "classify-519cb",
  storageBucket: "classify-519cb.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-ABCDEFGH",
};

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener("install", function (event) {
  console.log("Hello world from the Service Worker :call_me_hand:");
});
