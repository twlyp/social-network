import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { receiveFriendsWannabes, acceptFriend, unfriend } from "../actions";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => dispatch(receiveFriendsWannabes()), []);

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

    function clickHandler(operation, id) {
        if (operation === "accept") return dispatch(acceptFriend(id));
        if (operation === "delete") return dispatch(unfriend(id));
    }

    function makeEntry(user) {
        return (
            <li key={user.id} className="inset-card">
                <img
                    className="thumbnail"
                    src={user.image}
                    alt={`${user.first} ${user.last}'s profile picture'`}
                />

                <span className="name">
                    {user.first} {user.last}
                </span>
                <div className="button-row">
                    <button
                        name={user.accepted ? "delete" : "accept"}
                        onClick={(e) => clickHandler(e.target.name, user.id)}
                    >
                        {user.accepted ? "👢" : "📯"}
                    </button>
                    {!user.accepted && (
                        <button
                            name="delete"
                            onClick={(e) =>
                                clickHandler(e.target.name, user.id)
                            }
                        >
                            👢
                        </button>
                    )}
                </div>
            </li>
        );
    }

    return (
        <div className="friends-page">
            <h2>squirrel friends 🐿</h2>
            <ul className="friends-list">
                {friends && friends.map((user) => makeEntry(user))}
            </ul>
            <h2>toot 📯 or boot? 👢</h2>
            <ul className="friends-list">
                {wannabes && wannabes.map((user) => makeEntry(user))}
            </ul>
        </div>
    );
}
