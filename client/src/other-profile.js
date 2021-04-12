import React from "react";
import axios from "./utils/axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        const { data } = await axios.get(
            `/user/${this.props.match.params.id}.json`
        );
        if (!data.success) {
            this.props.history.push("/"); //maybe render an error message instead of redirecting?
        }
        this.setState(data.user);
    }
    render() {
        return (
            <div className="profile">
                <h2 className="name">
                    {this.state.first} {this.state.last}
                </h2>
                <img
                    className="profile-pic"
                    src={this.state.url || "./silhouette1.jpg"}
                    alt={this.state.first + " " + this.state.last}
                />
                <div className="bio">
                    <h3>They say about themselves:</h3>
                    <p className="bio-text">{this.state.bio}</p>
                </div>
            </div>
        );
    }
}
