import BioEditor from "./bio-editor";
import ProfilePic from "./profile-pic";

export default function Profile(props) {
    return (
        <div className="profile">
            <h2 className="name">
                {props.first} {props.last}
            </h2>
            <ProfilePic
                first={props.first}
                last={props.last}
                url={props.url}
                toggleUploader={props.toggleUploader}
            />
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
