export default function (state = {}, action) {
    const { type, payload } = action;

    // friendships
    if (type === "RECEIVE_FRIENDS_WANNABES")
        state = { ...state, friendsList: payload };
    if (type === "ACCEPT_FRIEND")
        state = {
            ...state,
            friendsList: state.friendsList.map((user) => {
                if (user.id === payload) user.accepted = true;
                return user;
            }),
        };
    if (type === "UNFRIEND")
        state = {
            ...state,
            friendsList: state.friendsList.filter(
                (user) => user.id !== payload
            ),
        };
    // user data
    if (type === "GET_DATA") state = { ...state, user: payload };
    if (type === "TOGGLE_UPLOADER")
        state = { ...state, uploaderVisible: !state.uploaderVisible };
    if (type === "SET_PIC")
        state = { ...state, user: { ...state.user, image: payload } };
    if (type === "SET_BIO")
        state = {
            ...state,
            user: { ...state.user, bio: payload },
        };

    //chat
    if (type === "RECEIVE_CHAT_HISTORY")
        state = { ...state, chatMessages: payload };
    if (type === "ADD_MSG") {
        state = state.chatMessages
            ? { ...state, chatMessages: [payload, ...state.chatMessages] }
            : { ...state, chatMessages: Array(payload) };
    }

    if (type === "ERROR")
        //error handling
        state = { ...state, error: action.error };

    return state;
}
