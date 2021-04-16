import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import * as actions from "../redux/actions";

export default function usePicUpload() {
    const [inProgress, setInProgress] = useState(false);
    const dispatch = useDispatch();

    async function handleChange(e) {
        setInProgress(true);
        const formdata = new FormData();
        formdata.append("file", e.target.files[0]);
        const { data } = await axios.post("/profile-pic", formdata);
        setInProgress(false);
        dispatch(
            data.success
                ? actions.setProfilePic(data.image)
                : actions.error(data.error)
        );
        dispatch(actions.toggleUploader());
    }

    return [inProgress, handleChange];
}
