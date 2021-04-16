import BioEditor from "./bio-editor";
import { render, waitFor, fireEvent } from "@testing-library/react";
import axios from "../utils/axios";

jest.mock("./utils/axios");

test('when no bio is passed, the button sais "add"', () => {
    const { container } = render(<BioEditor />);
    expect(container.querySelector("button").innerHTML).toBe("Add");
});

test('when a bio is passed, the button sais "edit"', () => {
    const { container } = render(<BioEditor bio={"whatever"} />);
    expect(container.querySelector("button").innerHTML).toBe("Edit");
});

test('clicking "add" or "edit" causes a textarea and "save" to be rendered', () => {
    const { container } = render(<BioEditor />);
    fireEvent.click(container.querySelector("#edit"));
    expect(container.innerHTML).toContain("textarea");
    expect(container.querySelector("#save")).not.toBeNull();
});

axios.post.mockResolvedValue({
    data: {
        success: true,
    },
});

test('clicking "save" causes an ajax request', () => {
    const { container } = render(<BioEditor setBio={() => {}} />);
    fireEvent.click(container.querySelector("#edit"));
    fireEvent.click(container.querySelector("#save"));
    expect(axios.post.mock.calls).toHaveLength(1);
});

test(
    "when the mock request is successful, " +
        "the function that was passed as a prop " +
        "to the component gets called",
    async () => {
        const mockSetBio = jest.fn();
        const { container } = render(<BioEditor setBio={mockSetBio} />);
        fireEvent.click(container.querySelector("#edit"));
        fireEvent.click(container.querySelector("#save"));
        await waitFor(() => expect(container.querySelector("save")).toBeNull());
        expect(mockSetBio.mock.calls).toHaveLength(1);
    }
);
