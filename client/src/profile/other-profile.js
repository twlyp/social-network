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
            <div className="profile-pic">
                <img
                    src={user.image || "/silhouette.jpg"}
                    alt={`${user.first} ${user.last}'s profile pic`}
                />
            </div>
            <div className="bio">
                <h3>They say about themselves:</h3>
                <p>{user.bio}</p>
            </div>
            <FriendButton target={profileId} />
        </div>
    );
}
