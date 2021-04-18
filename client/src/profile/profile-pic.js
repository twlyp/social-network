import { useDispatch } from "react-redux";
import { toggleUploader } from "../actions";

export default function ProfilePic(props) {
    const dispatch = useDispatch();
    return (
        <div className="profile-pic">
            <img
                onClick={() => dispatch(toggleUploader())}
                src={props.image || "silhouette2.jpg"}
                alt={`${props.first} ${props.last}'s profile picture`}
            />
        </div>
    );
}
