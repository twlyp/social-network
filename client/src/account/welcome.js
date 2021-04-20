import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset-password";
import Sketch from "./sketch";

export default function Welcome() {
    return (
        <div id="welcome">
            <Sketch />
            <div className="headline">
                <h1>KIKI</h1>
                <h4>connect with local drag queens</h4>
            </div>
            <HashRouter>
                <Route exact path="/">
                    <Registration />
                    <Link className="form-link" to="/login">
                        Log in instead
                    </Link>
                </Route>
                <Route path="/login">
                    <Login />
                    <Link className="form-link" to="/reset">
                        Forgot your password?
                    </Link>
                    <Link className="form-link" to="/">
                        Register instead
                    </Link>
                </Route>
                <Route path="/reset">
                    <ResetPassword />
                    <Link className="form-link" to="/login">
                        Log in
                    </Link>
                </Route>
            </HashRouter>
        </div>
    );
}
