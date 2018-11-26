import * as React from "react";

export class Unsupported extends React.Component<{}> {
    public render() {

        // adding the styles here to keep dependency as little as possible.
        const style = {
            marginTop: "10em"
        };

        return (
            <div style={style} className="ui raised very padded text container segment">
                <h2>
                    The current browser is not supported. For the best experience we recommend using Edge, Chrome or FireFox to access the site.
                </h2>
            </div>
        );
    }
}