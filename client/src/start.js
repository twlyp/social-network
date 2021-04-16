import ReactDOM from "react-dom";
import Welcome from "./account/welcome";
import App from "./app";
import ErrorMessage from "./errorMessage";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "./redux/reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

ReactDOM.render(
    <Provider store={store}>
        <ErrorMessage />
        {location.pathname == "/welcome" ? <Welcome /> : <App />}
    </Provider>,
    document.querySelector("main")
);
