import axios from "./utils/axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    console.log(data.error);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        payload: data.friends,
    };
}

export async function acceptFriend() {
    const { data } = await axios.post();
    return {
        type: "ACCEPT_FRIEND",
    };
}
export async function unfriend() {}
