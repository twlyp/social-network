import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import * as actions from "../actions";

export default function useAxiosGet(url) {
    const [output, setOutput] = useState("");
    const dispatch = useDispatch();
    const getData = async () => {
        const { data } = await axios.get(url);
        data.success ? setOutput(data) : dispatch(actions.error(data.error));
    };
    return [output, getData];
}
