import axios from "./utils/axios";

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
