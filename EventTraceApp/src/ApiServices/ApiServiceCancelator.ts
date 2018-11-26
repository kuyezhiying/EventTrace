import { ApiService } from "./ApiService";
import { GuidGenerator } from "./GuidGenerator";

export class ApiServiceCancelator {
    private id: string;
    constructor() {
        this.id = GuidGenerator.newGuid();
    }

    public get Id() {
        return this.id;
    }

    public cancel() {
        ApiService.cancel(this.id);
    }
}