import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import useStatefulFields from "../hooks/useStatefulFields";
import * as actions from "../redux/actions";

import { useState } from "react";

export default function ResetPassword() {
    const [step, setStep] = useState(1);
    const [values, handleChange] = useStatefulFields();
    const dispatch = useDispatch();

    async function handleClick(e) {
        const { data } = await axios.post(
            `/password/reset/${e.target.name}`,
            values
        );
        if (!data.success) return dispatch(actions.error(data.error));
        setStep(step + 1);
    }

    return (
        <div>
            <h1>Password reset</h1>

            {step === 1 && (
                <div>
                    <input
                        type="text"
                        name="email"
                        placeholder="email"
                        onChange={handleChange}
                    />
                    <button name="start" onClick={handleClick}>
                        Reset password
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <input
                        type="text"
                        name="code"
                        placeholder="code"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="new password"
                        onChange={handleChange}
                    />
                    <button onClick={handleClick}>Confirm reset</button>
                </div>
            )}

            {step === 3 && <div>All done! You can use your new password.</div>}
        </div>
    );
}
