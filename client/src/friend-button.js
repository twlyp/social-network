import { useState, useEffect } from "react";
import axios from "./utils/axios";

const statuses = {
    none: "Add friend",
    friends: "End friendship",
    waiting: "Cancel request",
    open: "Accept request",
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
            `/friendship/${props.target}${
                e.target.id === "reject" && "/reject"
            }`
        );
        return data.success ? setStatus(data.status) : setError(data.error);
    }

    useEffect(() => {
        getStatus();
    }, []);

    return (
        <>
            <button onClick={clickHandler}>{statuses[status]}</button>
            {status === "open" && (
                <button onClick={clickHandler} id="reject">
                    Reject request
                </button>
            )}
        </>
    );
}
