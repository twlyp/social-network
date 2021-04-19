import { useEffect, useState, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state.chatMessages || []);
    const [text, setText] = useState("");

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    function send() {
        socket.emit("chatMessage", text);
        setText(""); // clears input field after we click enter
    }

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // this will prevent going to the next line
            send();
        }
    };

    return (
        <div id="chat">
            <ul className="chat-messages-container" ref={elemRef}>
                {[...chatMessages].reverse().map((msg) => (
                    <li className="inset-card" key={msg.id}>
                        <div>
                            <img src={msg.image} />
                        </div>
                        <div className="msg-body">
                            <p>{msg.text}</p>
                            <div>
                                {msg.first} {msg.last} on {msg.time}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="msg-composer">
                <textarea
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                ></textarea>
                <button onClick={send}>🗣</button>
            </div>
        </div>
    );
}
