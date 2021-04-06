import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            {/* <img src="/logo.png" /> */}
            <HashRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                        <Link to="/login">Log in instead.</Link>
                    </Route>
                    <Route path="/login">
                        <Login />
                        <Link to="/">Register instead.</Link>
                    </Route>
                </div>
            </HashRouter>
        </div>
    );
}
