import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset-password";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
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
