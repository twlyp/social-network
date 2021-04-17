import { useDispatch } from "react-redux";
import usePicUpload from "../hooks/usePicUpload";
import { toggleUploader } from "../redux/actions";

export default function Uploader() {
    const dispatch = useDispatch();
    const [inProgress, handleChange] = usePicUpload();

    return (
        <div
            className="uploader modal"
            onClick={() => dispatch(toggleUploader())}
        >
            <div className="modal-message">
                {inProgress ? (
                    <p>Uploading...</p>
                ) : (
                    <>
                        <p>Please upload a new profile picture.</p>
                        <input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
