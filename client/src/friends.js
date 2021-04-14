import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import * as actions from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    async function getFriendsWannabes() {
        dispatch(actions.receiveFriendsWannabes());
    }
    useEffect(getFriendsWannabes, []);

    const friends = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter((user) => !!user.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter((user) => !user.accepted)
    );

    function clickHandler(action, id) {
        if (action === "accept") return dispatch(actions.acceptFriend(id));
        if (action === "delete") return dispatch(actions.unfriend(id));
    }

    function makeEntry(user) {
        return (
            <li key={user.id}>
                <h5>
                    {user.first} {user.last}
                </h5>
                <img
                    className="thumbnail"
                    src={user.url}
                    alt={`${user.first} ${user.last}'s profile picture'`}
                />
                <button
                    name={user.accepted ? "delete" : "accept"}
                    onClick={(e) => clickHandler(e.target.name, user.id)}
                >
                    {user.accepted ? "Remove" : "Accept"}
                </button>
                {!user.accepted && (
                    <button
                        name="delete"
                        onClick={(e) => clickHandler(e.target.name, user.id)}
                    >
                        Reject
                    </button>
                )}
            </li>
        );
    }

    return (
        <div className="friends-page">
            <h2>Your friends:</h2>
            <ul className="friends-list">
                {friends && friends.map((user) => makeEntry(user))}
            </ul>
            <h2>The wannabes:</h2>
            <ul className="wannabes-list">
                {wannabes && wannabes.map((user) => makeEntry(user))}
            </ul>
        </div>
    );
}
