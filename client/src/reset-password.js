import { Component } from "react";
import axios from "./utils/axios";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            step: 1,
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
        const route = (() => {
            if (this.state.step === 1) return "/password/reset/start";
            if (this.state.step === 2) return "/password/reset/verify";
            return null;
        })();

        axios
            .post(route, this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: this.state.step + 1,
                    });
                } else {
                    this.setState({
                        error: data.error,
                    });
                }
            })
            .catch((err) => console.log("err in post /login: ", err));
    }

    render() {
        return (
            <div>
                <h1>This is our password reset</h1>

                {this.state.error && (
                    <p className="error">{this.state.error}</p>
                )}

                {this.state.step == 1 && (
                    <div>
                        <input
                            type="text"
                            name="email"
                            placeholder="email"
                            onChange={this.handleChange}
                        />
                        <button onClick={this.handleClick}>
                            Reset password
                        </button>
                    </div>
                )}

                {this.state.step == 2 && (
                    <div>
                        <input
                            type="text"
                            name="code"
                            placeholder="code"
                            onChange={this.handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="new password"
                            onChange={this.handleChange}
                        />
                        <button onClick={this.handleClick}>
                            Confirm reset
                        </button>
                    </div>
                )}

                {this.state.step === 3 && (
                    <div>All done! You can use your new password.</div>
                )}
            </div>
        );
    }
}
