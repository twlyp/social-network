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
    if (action.type === "TOGGLE_UPLOADER")
        state = { ...state, uploaderVisible: !state.uploaderVisible };
    if (action.type === "GET_DATA") state = { ...state, user: action.payload };
    if (action.type === "SET_PIC")
        state = { ...state, user: { ...state.user, image: action.payload } };
    if (action.type === "SET_BIO")
        state = {
            ...state,
            user: { ...state.user, bio: action.payload },
        };

    if (action.type === "ERROR") state = { ...state, error: action.error };

    return state;
}
