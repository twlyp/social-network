import { Component } from "react";
import axios from "./utils/axios";

import Logo from "./logo.js";
import ProfilePic from "./profile-pic.js";
import Uploader from "./uploader.js";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            uploaderVisible: false,
            error: false,
        };

        this.toggleUploader = this.toggleUploader.bind(this);
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

    toggleUploader() {
        this.setState((prevState) => {
            return {
                uploaderVisible: !prevState.uploaderVisible,
            };
        });
    }

    render() {
        return (
            <section id={"app"}>
                <Logo />
                <ProfilePic
                    {...this.state.user}
                    toggleUploader={this.toggleUploader}
                />
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
