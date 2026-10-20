importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-messaging.js');
const firebaseConfig = {
    apiKey: "AIzaSyBC14ua20Sa6zS_ZcfYYnj8ih1hDRE1Wq8",
    authDomain: "fgs-connect-portal.firebaseapp.com",
    databaseURL: "https://fgs-connect-portal-default-rtdb.firebaseio.com",
    projectId: "fgs-connect-portal",
    storageBucket: "fgs-connect-portal.appspot.com",
    messagingSenderId: "411103962881",
    appId: "1:411103962881:web:c79fef756c1ef73b7e9d00"
        // apiKey: "AIzaSyDhDSnk_tZw_gVES58AaWbGR8FO5NlQHzQ",
        // authDomain: "fgspmproduction.firebaseapp.com",
        // databaseURL: "https://fgspmproduction-default-rtdb.firebaseio.com",
        // projectId: "fgspmproduction",
        // storageBucket: "fgspmproduction.appspot.com",
        // messagingSenderId: "963646818786",
        // appId: "1:963646818786:web:438dc0bd05f829a19d51bb",
        // measurementId: "G-X2Z1NKDS23"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();