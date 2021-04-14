import { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "./utils/axios";

import Logo from "./logo";
import Profile from "./profile";
import Uploader from "./uploader";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";
import Friends from "./friends";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            uploaderVisible: false,
            error: false,
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.setBio = this.setBio.bind(this);
        this.setProfilePic = this.setProfilePic.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/user");
        if (data.success) {
            this.setState({ user: data.user });
        } else {
            this.setState({ error: data.error });
        }
    }

    setProfilePic(profilePic) {
        this.setState((prevState) => {
            return {
                user: {
                    ...prevState.user,
                    url: profilePic,
                },
            };
        });
    }

    setBio(bio) {
        this.setState((prevState) => {
            return {
                user: {
                    ...prevState.user,
                    bio,
                },
            };
        });
    }

    toggleUploader(e) {
        e && e.stopPropagation();
        this.setState((prevState) => {
            return {
                uploaderVisible: !prevState.uploaderVisible,
            };
        });
    }

    logout() {
        axios.post("/logout");
        location.replace("/welcome");
    }

    render() {
        return (
            <section id={"app"}>
                <Logo />
                <Router>
                    <FindPeople />

                    <Link to="/">Profile</Link>
                    <Link to="/friends">Friends</Link>

                    <button onClick={this.logout}>Logout</button>

                    <div className="profile">
                        <Route exact path="/">
                            <Profile
                                first={this.state.user.first}
                                last={this.state.user.last}
                                url={this.state.user.url}
                                toggleUploader={this.toggleUploader}
                                bio={this.state.user.bio}
                                setBio={this.setBio}
                            />
                        </Route>
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

                {this.state.uploaderVisible && (
                    <Uploader
                        toggleUploader={this.toggleUploader}
                        setProfilePic={(profilePic) =>
                            this.setProfilePic(profilePic)
                        }
                    />
                )}
            </section>
        );
    }
}
