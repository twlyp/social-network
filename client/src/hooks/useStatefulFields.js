import { useState } from "react";

const RE = {
    first: /./,
    last: /./,
    email: /.@./,
    password: /.{3,}/,
};

export default function useStatefulFields({
    withValidation = false,
    enterSubmits = false,
}) {
    const [values, setValues] = useState({});
    const [validity, setValidity] = useState({});

    const keyCheck = (e, callback) => {
        if (e.key === "Enter") {
            e.preventDefault();
            return callback(e);
        }
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setValues({
            ...values,
            [name]: value,
        });
        if (withValidation) {
            const isValid = !!value && RE[name].test(value);
            setValidity({
                ...validity,
                [name]: isValid,
            });
        }
    };

    let output = [values, handleChange];
    withValidation && output.push(validity);
    enterSubmits && output.push(keyCheck);

    return output;
}
