import { Component } from "react";
import axios from "./utils/axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = { file: null, inProgress: false };
        this.handleChange = this.handleChange.bind(this);
    }

    setStateAsync(newState) {
        return new Promise((resolve) => this.setState(newState, resolve));
    }

    async handleChange(e) {
        this.setState({ inProgress: true });
        const formdata = new FormData();
        formdata.append("file", e.target.files[0]);
        const { data } = await axios.post("/profile-pic", formdata);
        this.setState({ inProgress: false });
        if (data.success) {
            this.props.setProfilePic(data.url);
        } else {
            this.setState({ error: data.error });
        }
        this.props.toggleUploader();
    }

    render() {
        return (
            <div className="uploader modal" onClick={this.props.toggleUploader}>
                <div className="modal-message">
                    {this.state.inProgress ? (
                        <p>Uploading...</p>
                    ) : (
                        <>
                            <p>Please upload a new profile picture.</p>
                            <input
                                type="file"
                                name="file"
                                onChange={this.handleChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </>
                    )}
                </div>
            </div>
        );
    }
}
