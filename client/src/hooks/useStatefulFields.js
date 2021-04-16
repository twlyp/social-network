import { useState } from "react";

const RE = {
    first: /./,
    last: /./,
    email: /.@./,
    password: /.{3,}/,
};

export default function useStatefulFields(withValidation = false) {
    const [values, setValues] = useState({});
    const [validity, setValidity] = useState({});

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
    return [values, handleChange, validity];
}
