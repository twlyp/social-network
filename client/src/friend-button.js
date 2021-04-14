import { useState, useEffect } from "react";
import axios from "./utils/axios";

const actions = {
    none: { tag: "ask", string: "Add friend" },
    friends: { tag: "delete", string: "End friendship" },
    waiting: { tag: "delete", string: "Cancel request" },
    open: { tag: "accept", string: "Accept request" },
};

export default function FriendButton(props) {
    const [error, setError] = useState("");
    const [status, setStatus] = useState("none");

    async function getStatus() {
        const { data } = await axios.get(`/friendship/${props.target}`);
        return data.success ? setStatus(data.status) : setError(data.error);
    }

    async function clickHandler(e) {
        setError("");
        const { data } = await axios.post(
            `/friendship/${props.target}/${e.target.id}`
        );
        return data.success ? setStatus(data.status) : setError(data.error);
    }

    useEffect(() => {
        getStatus();
    }, []);

    return (
        <>
            <button onClick={clickHandler} id={actions[status].tag}>
                {actions[status].string}
            </button>
            {status === "open" && (
                <button onClick={clickHandler} id="delete">
                    Reject request
                </button>
            )}
        </>
    );
}
