import * as React from "react";

import { BrowserRouter } from "react-router-dom";
import { Provider, observer } from "mobx-react";
import { EventStore } from "../Stores/EventStore";

@observer
export class App extends React.Component<{}> {
    private eStore: EventStore;

    public async render() {
        const Homepage = await this.renderHomepage();
        return (
            <Provider>
                <BrowserRouter>
                    {Homepage}
                </BrowserRouter>
            </Provider>
        );
    }

    private async renderHomepage() {
        const events: any[] = await this.getEvents();
        console.log("events: ", events);
        return (
            <div>
                Home page. We have {events.length} events for now.
            </div>
        );
    }

    private async getEvents() {
        return await this.eStore.getEvents();
    }
}