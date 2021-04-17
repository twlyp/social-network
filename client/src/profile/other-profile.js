import axios from "../utils/axios";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { error } from "../actions";

import FriendButton from "../friends/friend-button";

export default function OtherProfile(props) {
    const [user, setUser] = useState({});
    const dispatch = useDispatch();

    const profileId = props.match.params.id;

    const getData = async () => {
        const { data } = await axios.get(`/user/${profileId}.json`);
        if (data.success) return setUser(data.user);
        data.error && dispatch(error(data.error));
        location.replace("/");
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="profile">
            <h2 className="name">
                {user.first} {user.last}
            </h2>
            <img
                className="profile-pic"
                src={user.image || "/silhouette2.jpg"}
                alt={`${user.first} ${user.last}'s profile pic`}
            />
            <div className="bio">
                <h3>They say about themselves:</h3>
                <p className="bio-text">{user.bio}</p>
            </div>
            <FriendButton target={profileId} />
        </div>
    );
}
