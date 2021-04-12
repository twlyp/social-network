export default function Profile(props) {
    return (
        <div className="profile">
            <h2 className="name">
                {props.first} {props.last}
            </h2>
            {props.children}
        </div>
    );
}
