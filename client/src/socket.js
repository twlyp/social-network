import { chatHistory, chatMessage } from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) socket = io.connect();

    socket.on("chatHistory", (msgs) => store.dispatch(chatHistory(msgs)));

    socket.on("chatMessage", (msg) => {
        store.dispatch(chatMessage(msg));
    });
};
