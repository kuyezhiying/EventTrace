import EventApiService from "../Services/Event.service";

export class EventStore {
    private events: Event[];

    constructor() {
        this.init();
    }

    public init() {
        this.events = [];
    }

    public async getEvents() {
        this.events = await EventApiService.getAll();
        return this.events;
    }
}