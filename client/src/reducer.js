export default function (state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES")
        state = { ...state, friendsList: action.payload };
    if (action.type === "ACCEPT_FRIEND")
        state = {
            ...state,
            friendsList: state.friendsList.map((user) => {
                if (user.id === action.id) user.accepted = true;
                return user;
            }),
        };
    if (action.type === "UNFRIEND")
        state = {
            ...state,
            friendsList: state.friendsList.filter(
                (user) => user.id !== action.id
            ),
        };
    if (action.type === "ERROR") state = { ...state, error: action.error };

    return state;
}
