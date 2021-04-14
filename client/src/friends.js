import axios from "./utils/axios";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const action = actions.receiveFriendsWannabes();
    dispatch(action);

    // const friendsList = useSelector((state) => state.friendsList);

    return (
        <div className="friends-page">
            <h2>Your friends:</h2>
            {/* {friendsList} */}
            <h2>The wannabes:</h2>
        </div>
    );
}
