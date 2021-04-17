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

export default function Login() {
    const [values, handleChange, validity] = useStatefulFields("validate");
    const errorState = useSelector((state) => state.error);
    const dispatch = useDispatch();
    const handleSubmit = useAuthSubmit("/login", values);

    const isValid = () => {
        if (!(values.email && values.password)) return false;

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
        <div>
            <h1>This is our login component</h1>

            <input
                type="text"
                name="email"
                placeholder="email"
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
            />
            <button onClick={(e) => isValid() && handleSubmit(e)}>
                Log in
            </button>
        </div>
    );
}
