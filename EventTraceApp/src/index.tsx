import "babel-polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./Apps/App";
import { AppContainer } from "react-hot-loader";
import { Unsupported } from "./Components/Common/Unsupported";

// checks if it is IE and version < 12
const isOldBrowsers = () => {
    const ua = window.navigator.userAgent;
    const result = ua.match(/Trident/g) || ua.match(/MSIE/g);
    console.log("result: ", result);
    return result;
};

declare var module: { hot: any };

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(
    <AppContainer>
        {isOldBrowsers() ? <Unsupported /> : <App />}
    </AppContainer>,
    document.getElementById("index"));