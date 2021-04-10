export default function Profile(props) {
    return (
        <div id={"profile"}>
            <h2>
                {props.first} {props.last}
            </h2>
            {props.children}
        </div>
    );
}
