import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./utils/axios";

export default function findPeople() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

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

    return (
        <div className="search-bar">
            <input onChange={handleChange}></input>

            <ul className="search-results">
                {users.map((user, i) => (
                    <li key={i}>
                        <Link to={`/user/${user.id}`}>
                            {user.first + " " + user.last}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
