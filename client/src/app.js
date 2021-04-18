import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "./utils/axios";
import { getUserData } from "./actions";

import Logo from "./logo";
import Profile from "./profile/profile";
import Uploader from "./profile/uploader";
import OtherProfile from "./profile/other-profile";
import FindPeople from "./friends/find-people";
import Friends from "./friends/friends";
import Chat from "./chat";

export default function App() {
    const uploaderVisible = useSelector((state) => state.uploaderVisible);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserData());
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
                <nav>
                    <Link to="/">Profile</Link>
                    <Link to="/friends">Friends</Link>
                    <Link to="/chat">Chat</Link>
                    <button onClick={logout}>Logout</button>
                </nav>

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
                    <Route path="/chat" component={Chat} />
                </div>
            </Router>

            {uploaderVisible && <Uploader />}
        </section>
    );
}
