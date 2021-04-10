export default function ProfilePic(props) {
    return (
        <div>
            <img
                onClick={props.toggleUploader}
                src={props.url || "./silhouette1.jpg"}
                alt={props.first + " " + props.last}
            />
        </div>
    );
}
