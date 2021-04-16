import axios from "../utils/axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    return data.success
        ? {
              type: "RECEIVE_FRIENDS_WANNABES",
              payload: data.friends,
          }
        : { type: "ERROR", error: data.error };
}

export async function acceptFriend(id) {
    const { data } = await axios.post(`/friendship/${id}/accept`);
    return data.success
        ? {
              type: "ACCEPT_FRIEND",
              id,
          }
        : { type: "ERROR", error: data.error };
}
export async function unfriend(id) {
    const { data } = await axios.post(`/friendship/${id}/delete`);
    return data.success
        ? {
              type: "UNFRIEND",
              id,
          }
        : { type: "ERROR", error: data.error };
}
export async function toggleUploader() {
    return { type: "TOGGLE_UPLOADER" };
}
export async function getUserData() {
    const { data } = await axios.get("/user");
    return data.success
        ? {
              type: "GET_DATA",
              payload: data.user,
          }
        : { type: "ERROR", error: data.error };
}
export async function setProfilePic(image) {
    return {
        type: "SET_PIC",
        payload: image,
    };
}
export async function setBio(bio) {
    return {
        type: "SET_BIO",
        payload: bio,
    };
}

export async function error(err) {
    return { type: "ERROR", error: err };
}
