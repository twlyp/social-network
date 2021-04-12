import { Component } from "react";
import axios from "./utils/axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draft: "",
            isEditing: false,
            error: null,
        };
        this.save = this.save.bind(this);
        this.edit = this.edit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    async save() {
        const { data } = await axios.post("/bio", { draft: this.state.draft });
        if (data.success) {
            this.setState({ isEditing: false });
            this.props.setBio(this.state.draft);
        } else {
            this.setState({ error: data.error });
        }
    }

    edit() {
        this.setState({ isEditing: true });
    }

    handleInput(e) {
        this.setState({ draft: e.target.value });
    }

    render() {
        return (
            <div className="bio">
                <h3>Your bio:</h3>
                {this.state.isEditing ? (
                    <>
                        <textarea
                            onInput={this.handleInput}
                            defaultValue={this.props.bio}
                        ></textarea>
                        <button onClick={this.save} id="save">
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <p className="bio-text">{this.props.bio}</p>
                        <button onClick={this.edit} id="edit">
                            {this.props.bio ? "Edit" : "Add"}
                        </button>
                    </>
                )}
            </div>
        );
    }
}
