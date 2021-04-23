import BioEditor from "./bio-editor";
import ProfilePic from "./profile-pic";
import { useSelector } from "react-redux";

export default function Profile() {
    const user = useSelector((state) => state.user);

    return (
        <div className="profile">
            {user && (
                <>
                    <h2 className="name">
                        {user.first} {user.last}
                    </h2>
                    <ProfilePic
                        first={user.first}
                        last={user.last}
                        image={user.image}
                    />
                    <BioEditor bio={user.bio} />
                </>
            )}
        </div>
    );
}
