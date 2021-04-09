export default function ProfilePic(props) {
    return (
        <div onClick={props.toggleUploader}>
            <img
                src={props.url || "./silhouette1.jpg"}
                alt={props.first + " " + props.last}
            />
        </div>
    );
}
