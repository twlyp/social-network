import ReactDOM from "react-dom";

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <p>your logo component should go here</p>;
}

ReactDOM.render(elem, document.querySelector("main"));
