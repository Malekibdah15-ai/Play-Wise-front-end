import { io } from "socket.io-client";

// Replace with your actual backend URL
const URL = "http://localhost:8000"; 

const socket = io(URL, {
    autoConnect: true, // Connects as soon as the app loads
});

export default socket;