import { useState } from "react";
import axios from "../utils/axios";

export default function useAuthSubmit(url, values) {
    const [error, setError] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(url, values)
            .then(({ data }) =>
                data.success ? location.replace("/") : setError(data.error)
            );
    };
    return [error, handleSubmit];
}
