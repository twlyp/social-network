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
    const [values, handleChange, validity, keyCheck] = useStatefulFields({
        withValidation: true,
        enterSubmits: true,
    });
    const handleSubmit = useAuthSubmit("/register", values);
    const errorState = useSelector((state) => state.error);
    const dispatch = useDispatch();

    const isValid = () => {
        const required = ["first", "last", "email", "password"];

        let invalid = [];
        for (let key of required) validity[key] || invalid.push(NAMES[key]);
        if (invalid.length > 0) {
            dispatch(error(`Please enter valid ${invalid.join(", ")}.`));
            return false;
        }

        errorState && dispatch(error(""));
        return true;
    };

    const formClass = (field) =>
        "form-field " + (validity[field] ? "" : "invalid");

    return (
        <div className="auth-page">
            <div className="form">
                <input
                    className={formClass("first")}
                    type="text"
                    name="first"
                    placeholder={NAMES.first}
                    onChange={handleChange}
                    onKeyDown={(e) => isValid() && keyCheck(e, handleSubmit)}
                />
                <input
                    className={formClass("last")}
                    type="text"
                    name="last"
                    placeholder={NAMES.last}
                    onChange={handleChange}
                    onKeyDown={(e) => isValid() && keyCheck(e, handleSubmit)}
                />
                <input
                    className={formClass("email")}
                    type="text"
                    name="email"
                    placeholder={NAMES.email}
                    onChange={handleChange}
                    onKeyDown={(e) => isValid() && keyCheck(e, handleSubmit)}
                />
                <input
                    className={formClass("password")}
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleChange}
                    onKeyDown={(e) => isValid() && keyCheck(e, handleSubmit)}
                />
            </div>
            <button
                className="form-field"
                onClick={(e) => isValid() && handleSubmit(e)}
            >
                <span>register</span>
            </button>
        </div>
    );
}
