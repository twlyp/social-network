import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import useStatefulFields from "../hooks/useStatefulFields";
import { error } from "../actions";

import { useState } from "react";

export default function ResetPassword() {
    const [step, setStep] = useState(1);
    const [values, handleChange] = useStatefulFields({});
    const dispatch = useDispatch();

    async function handleClick(e) {
        const { data } = await axios.post(
            `/password/reset/${e.target.name}`,
            values
        );
        if (!data.success) return dispatch(error(data.error));
        setStep(step + 1);
    }

    return (
        <div className="auth-page">
            {step === 1 && (
                <>
                    <div className="form">
                        {
                            <input
                                className="form-field"
                                type="text"
                                name="email"
                                placeholder="email"
                                onChange={handleChange}
                            />
                        }
                    </div>
                    <button
                        className="form-field"
                        name="start"
                        onClick={handleClick}
                    >
                        Reset
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="form">
                        <input
                            className="form-field"
                            type="text"
                            name="code"
                            placeholder="code"
                            onChange={handleChange}
                        />
                        <input
                            className="form-field"
                            type="password"
                            name="password"
                            placeholder="new password"
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        className="form-field"
                        name="verify"
                        onClick={handleClick}
                    >
                        Confirm reset
                    </button>
                </>
            )}

            {step === 3 && (
                <div className="form">
                    <h2 className="done-reset">
                        All done! You can use your new password.
                    </h2>
                </div>
            )}
        </div>
    );
}
