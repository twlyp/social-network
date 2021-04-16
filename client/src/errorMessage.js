import { useSelector } from "react-redux";

export default function ErrorMessage() {
    const error = useSelector((state) => state.error);
    return <>{error && <div className="error">{error}</div>}</>;
}
