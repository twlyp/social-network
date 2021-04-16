import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../redux/actions";
import axios from "../utils/axios";

const COMMANDS = {
    none: { tag: "ask", string: "Add friend" },
    friends: { tag: "delete", string: "End friendship" },
    waiting: { tag: "delete", string: "Cancel request" },
    open: { tag: "accept", string: "Accept request" },
};

export default function FriendButton(props) {
    const dispatch = useDispatch();
    const [status, setStatus] = useState("none");

    async function getStatus() {
        const { data } = await axios.get(`/friendship/${props.target}`);
        return data.success
            ? setStatus(data.status)
            : dispatch(actions.error(data.error));
    }

    async function clickHandler(e) {
        const { data } = await axios.post(
            `/friendship/${props.target}/${e.target.name}`
        );
        return data.success
            ? setStatus(data.status)
            : dispatch(actions.error(data.error));
    }

    useEffect(() => {
        getStatus();
    }, []);

    return (
        <>
            <button onClick={clickHandler} name={COMMANDS[status].tag}>
                {COMMANDS[status].string}
            </button>
            {status === "open" && (
                <button onClick={clickHandler} name="delete">
                    Reject request
                </button>
            )}
        </>
    );
}
