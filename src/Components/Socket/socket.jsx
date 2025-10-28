import { io } from "socket.io-client"

const URL = import.meta.env.VITE_URL_SOCKET

export const socket = io(URL, {
    transports: ['websocket'],    
})