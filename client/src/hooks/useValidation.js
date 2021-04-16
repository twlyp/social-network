import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../actions";

const NAMES = {
    first: "first name",
    last: "last name",
    email: "e-mail",
    password: "password (min. 3 characters)",
};

export default function useValidation(validity, required) {
    const [isValid, setValid] = useState(true);
    const error = useSelector((state) => state.error);
    const dispatch = useDispatch();

    let invalid = [];
    required.forEach((r) => validity[r] || invalid.push(NAMES[r]));

    if (invalid.length > 0) {
        dispatch(actions.error(`Please enter valid ${invalid.join(", ")}.`));
        return setValid(false);
    }

    error && dispatch(actions.error(""));

    return isValid;
}
