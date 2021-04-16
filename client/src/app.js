import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "./utils/axios";
import * as actions from "./redux/actions.js";

import Logo from "./logo";
import Profile from "./profile/profile";
import Uploader from "./profile/uploader";
import OtherProfile from "./profile/other-profile";
import FindPeople from "./friends/find-people";
import Friends from "./friends/friends";

export default function App() {
    const uploaderVisible = useSelector((state) => state.uploaderVisible);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getUserData());
    }, []);

    function logout() {
        axios.post("/logout");
        location.replace("/welcome");
    }

    return (
        <section id="app">
            <Logo />
            <Router>
                <FindPeople />

                <Link to="/">Profile</Link>
                <Link to="/friends">Friends</Link>

                <button onClick={logout}>Logout</button>

                <div className="profile">
                    <Route exact path="/" component={Profile} />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route path="/friends" component={Friends} />
                </div>
            </Router>

            {uploaderVisible && <Uploader />}
        </section>
    );
}
