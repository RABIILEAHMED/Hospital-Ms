import { io } from "socket.io-client"

const socket = io("https://hospital-ms-ask1.onrender.com", {
  transports: ["websocket"]
})

export default socket