import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";

export default function findPeople() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [isFocused, setFocus] = useState(false);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        let abort = false;
        (async () => {
            const { data } = await axios.get(
                `/users/?q=${encodeURIComponent(query)}`
            );
            if (!abort && data.success) {
                setUsers(data.users);
            }
        })();

        return () => {
            // cleanup function
            abort = true;
        };
    }, [query]);

    const barStyle = {
        position: "relative",
        margin: "0 1rem",
        width: "100%",
    };
    const inputStyle = {
        height: "2rem",
        width: "100%",
        textAlign: "center",
        // position: "absolute",
        // top: "0",
        // left: "0",
    };
    const resultsStyle = {
        position: "absolute",
        left: "50%",
        // minWidth: "200px",
        width: "99%",
        margin: "2px 0",
        padding: "0.2rem",
        transform: "translateX(-50%)",
        background: "var(--white)",
        border: "2px solid var(--violet)",
        borderRadius: "0.5rem",
    };

    return (
        <div style={barStyle} className="search-bar">
            <input
                style={inputStyle}
                onChange={handleChange}
                onFocus={() => setFocus(true)}
                onBlur={(e) => {
                    if (e.relatedTarget && /user/.test(e.relatedTarget.href))
                        return e.preventDefault();

                    setFocus(false);
                }}
            ></input>

            {isFocused && (
                <ul style={resultsStyle} className="search-results">
                    {users.map((user, i) => (
                        <li key={i}>
                            <Link
                                to={`/user/${user.id}`}
                                onClick={() => setFocus(false)}
                            >
                                {user.first + " " + user.last}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
