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

        this.showUploader = this.showUploader.bind(this);
    }

    async componentDidMount() {
        // 1. Fetch the user data when our App component mounts
        const { data } = await axios.get("/user");
        if (data.success) {
            this.setState({ user: data.response });
            console.log("this.state:", this.state);
        } else {
            this.setState({ error: data.error });
        }
    }

    // Method to update the profilePic state after upload. To be passed down to <Uploader />
    setProfilePic(profilePic) {
        this.setState((prevState) => {
            return {
                user: {
                    ...prevState.user,
                    profilePic,
                },
            };
        });
    }

    toggleUploader() {
        this.setState({ uploaderVisible: !this.state.uploaderVisible });
    }

    render() {
        return (
            <section id={"app"}>
                <Logo />
                <ProfilePic
                    first={this.state.user.first}
                    last={this.state.user.last}
                    profilePicUrl={this.state.user.profilePicUrl}
                    // You may want to shorten the 3 lines above with: {...this.state.user}

                    toggleUploader={this.toggleUploader}
                />
                {this.state.uploaderVisible && (
                    // Uploader will also need to be passed a method to be able to close itself ;)
                    <Uploader
                        // Method 2 to preserve context: use an arrow function to capture the current context
                        setProfilePic={(profilePic) =>
                            this.setProfilePic(profilePic)
                        }
                    />
                )}
            </section>
        );
    }
}
