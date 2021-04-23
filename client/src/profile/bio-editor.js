import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBio } from "../actions";

export default function BioEditor(props) {
    const [isEditing, setEditing] = useState(false);
    const [draft, setDraft] = useState("");
    const dispatch = useDispatch();

    function save() {
        dispatch(setBio(draft));
        setEditing(false);
    }

    return (
        <div className="bio inset-card">
            <h3>Your bio:</h3>
            {isEditing ? (
                <>
                    <textarea
                        cols="30"
                        rows="3"
                        onInput={(e) => setDraft(e.target.value)}
                        defaultValue={props.bio}
                    ></textarea>
                    <button onClick={save} id="save">
                        Save
                    </button>
                </>
            ) : (
                <>
                    <p>{props.bio || "Tell us something about yourself!"}</p>
                    <button
                        onClick={() => {
                            setEditing(true);
                            setDraft(props.bio);
                        }}
                        name="edit"
                    >
                        {props.bio ? "Edit" : "Add"}
                    </button>
                </>
            )}
        </div>
    );
}
