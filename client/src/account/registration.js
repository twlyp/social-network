import useStatefulFields from "../hooks/useStatefulFields";
import useAuthSubmit from "../hooks/useAuthSubmit";
import { useDispatch, useSelector } from "react-redux";

import { error } from "../actions";

const NAMES = {
    first: "first name",
    last: "last name",
    email: "e-mail",
    password: "password (min. 3 characters)",
};

export default function Registration() {
    const [values, handleChange, validity] = useStatefulFields("validate");
    const handleSubmit = useAuthSubmit("/register", values);
    const errorState = useSelector((state) => state.error);
    const dispatch = useDispatch();

    const isValid = () => {
        if (!(values.first && values.last && values.email && values.password))
            return false;

        let invalid = [];
        for (let key in validity) validity[key] || invalid.push(NAMES[key]);

        if (invalid.length > 0) {
            dispatch(error(`Please enter valid ${invalid.join(", ")}.`));
            return false;
        }

        errorState && dispatch(error(""));
        return true;
    };

    return (
        <div id="registration">
            <h1>This is our registration component</h1>

            <input
                className={validity.first ? "" : "invalid"}
                type="text"
                name="first"
                placeholder="first"
                onChange={handleChange}
            />
            <input
                className={validity.last ? "" : "invalid"}
                type="text"
                name="last"
                placeholder="last"
                onChange={handleChange}
            />
            <input
                className={validity.email ? "" : "invalid"}
                type="text"
                name="email"
                placeholder="email"
                onChange={handleChange}
            />
            <input
                className={validity.password ? "" : "invalid"}
                type="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
            />
            <button onClick={(e) => isValid() && handleSubmit(e)}>
                register
            </button>
        </div>
    );
}
