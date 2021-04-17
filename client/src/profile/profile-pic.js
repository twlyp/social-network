import { useDispatch } from "react-redux";
import { toggleUploader } from "../actions";

export default function ProfilePic(props) {
    const dispatch = useDispatch();
    return (
        <img
            className="profile-pic"
            onClick={() => dispatch(toggleUploader())}
            src={props.image || "silhouette2.jpg"}
            alt={`${props.first} ${props.last}'s profile picture`}
        />
    );
}
