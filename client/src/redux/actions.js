import axios from "../utils/axios";

const action = (str, payload) => ({ type: str, payload });

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
export function toggleUploader() {
    return { type: "TOGGLE_UPLOADER" };
}
export async function getUserData() {
    const { data } = await axios.get("/user");
    return data.success ? action("GET_DATA", data.user) : error();
}
export const setProfilePic = (image) => action("SET_PIC", image);

export function error(err) {
    return { type: "ERROR", error: err };
}
