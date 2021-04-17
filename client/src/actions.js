import axios from "./utils/axios";

const action = (str, payload) => ({ type: str, payload });

// friends + wannabes
export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    return data.success
        ? action("RECEIVE_FRIENDS_WANNABES", data.friends)
        : error();
}
export async function acceptFriend(id) {
    const { data } = await axios.post(`/friendship/${id}/accept`);
    return data.success ? action("ACCEPT_FRIEND", id) : error();
}
export async function unfriend(id) {
    const { data } = await axios.post(`/friendship/${id}/delete`);
    return data.success ? action("UNFRIEND", id) : error();
}

// user data
export async function getUserData() {
    const { data } = await axios.get("/user");
    return data.success ? action("GET_DATA", data.user) : error();
}
export function toggleUploader() {
    return { type: "TOGGLE_UPLOADER" };
}
export const setProfilePic = (image) => action("SET_PIC", image);
export const setBio = (bio) => action("SET_BIO", bio);

// chat
export const chatHistory = (msgs) => action("RECEIVE_CHAT_HISTORY", msgs);
export const chatMessage = (msg) => action("ADD_MSG", msg);

// error handling
export function error(err) {
    return { type: "ERROR", error: err };
}
