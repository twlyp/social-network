import { Component } from "react";
// Use the CSURF axios instance ;)
import axios from "./axios";

// Those are from named exports, it will look differently if you have default exports ;)
import Logo from "./logo.js";
import ProfilePic from "./profile-pic.js";
import Uploader from "./uploader.js";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            uploaderVisible: false,
        };

        this.showUploader = this.showUploader.bind(this);
    }

    componentDidMount() {
        // 1. Fetch the user data when our App component mounts
        axios.get("/user").then((res) => {
            // 2. Update the state when you get the the user's data
            // ...
        });
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

    // You will also need a way to hide the uploader. Or you may want to change this to a toggle function
    showUploader() {
        this.setState({ uploaderVisible: true });
    }

    render() {
        return (
            <section id={"app"}>
                <Logo />
                <ProfilePic
                    firstName={this.state.user.firstName}
                    lastName={this.state.user.lastName}
                    profilePicUrl={this.state.user.profilePicUrl}
                    // You may want to shorten the 3 lines above with: {...this.state.user}

                    // This method is bound in the constructor, so we're good!
                    showUploader={this.showUploader}
                />
                {this.state.uploaderVisible && (
                    // Uploader will also need to be passed a method to be able to close itself ;)
                    <Uploader
                        // Method 2 to preserve context: use an arrow function to capture the current context
                        setProfilePic={(profilePic) =>
                            this.hideUploader(profilePic)
                        }
                    />
                )}
            </section>
        );
    }
}
