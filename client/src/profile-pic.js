export default function ProfilePic(props) {
    return (
        // <div className="profile-pic">
        <img
            className="profile-pic"
            onClick={props.toggleUploader}
            src={props.url || "./silhouette1.jpg"}
            alt={props.first + " " + props.last}
        />
        // </div>
    );
}
