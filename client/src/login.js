import { Component } from "react";
import axios from "./axios";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClick() {
        this.validate() &&
            axios
                .post("/login", this.state)
                .then(({ data }) => {
                    if (data.success) {
                        location.replace("/");
                    } else {
                        this.setState({
                            error: data.error,
                        });
                    }
                })
                .catch((err) => console.log("err in post /login: ", err));
    }

    validate() {
        const required = ["email", "password"];
        const invalid = required.filter((el) => !this.state[el]);
        console.log("invalid: ", invalid);
        if (invalid.length === 0) return true;
        this.setState({
            error: `Please fill out field(s): ${invalid.join(", ")}.`,
        });
        return false;
    }

    render() {
        return (
            <div>
                <h1>This is our login component</h1>

                {this.state.error && (
                    <p className="error">{this.state.error}</p>
                )}

                <input
                    type="text"
                    name="email"
                    placeholder="email"
                    onChange={this.handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={this.handleChange}
                />
                <button onClick={this.handleClick}>Log in</button>
            </div>
        );
    }
}
