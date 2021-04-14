export default function (state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES")
        state = { ...state, friendsList: action.payload };

    return state;
}
