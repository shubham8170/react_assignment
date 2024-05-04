// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAGpozd-nc8CIdFuCIVl578jwg9oxT65Ug",
  authDomain: "maasiddhipith.firebaseapp.com",
  projectId: "maasiddhipith",
  storageBucket: "maasiddhipith.appspot.com",
  messagingSenderId: "426419444839",
  appId: "1:426419444839:web:e87b4ab415b6ba1d1448c2",
  measurementId: "G-D59VSTYFP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async ()=>{
    const permission = await Notification.requestPermission();
    console.log(permission);
    if(permission === 'granted'){
    const token = await getToken(messaging, {
        vapidKey:"BBqpL0lMTGxb-beM1_1sSyK5AEqrZrG6cRbCCtdLCRmfHxRrS1mwuAYVp7uAJ888t7GsHhOPv9_8IwoWHcQPfT8"
    });
    console.log(token);
}
}
