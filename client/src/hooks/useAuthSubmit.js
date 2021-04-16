import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import * as actions from "../redux/actions";

export default function useAuthSubmit(url, values) {
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await axios.post(url, values);
        data.success
            ? location.replace("/")
            : dispatch(actions.error(data.error));
    };
    return handleSubmit;
}
