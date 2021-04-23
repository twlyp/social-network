import { useSelector, useDispatch } from "react-redux";
import { error } from "./actions";

export default function ErrorMessage() {
    const dispatch = useDispatch();
    const errorState = useSelector((state) => state.error);
    return (
        <>
            {" "}
            {errorState && (
                <div className="error-box" onClick={() => dispatch(error(""))}>
                    <h3>{errorState}</h3>
                </div>
            )}
        </>
    );
}
