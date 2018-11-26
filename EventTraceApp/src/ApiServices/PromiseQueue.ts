import { ApiServiceRequestScheduler } from "./ApiServiceRequestScheduler";
import { AxiosResponse } from "axios";

export class PromiseQueue {
    private scheduler: ApiServiceRequestScheduler;
    private queue: QueueItem[] = [];

    private maxPendingPromiseCount: number;
    private pendingPromiseCount: number = 0;

    constructor(maxPendingPromiseCount: number, apiServiceQueue: ApiServiceRequestScheduler) {
        this.scheduler = apiServiceQueue;
        this.maxPendingPromiseCount = maxPendingPromiseCount;
    }

    public add(item: QueueItem) {
        // tslint:disable-next-line:promise-must-complete
        return new Promise<AxiosResponse>((resolve, reject) => this.addQueueHandler({ ...item, resolve, reject }));
    }

    public async deQueue() {
        if (this.pendingPromiseCount >= this.maxPendingPromiseCount || this.scheduler.isPendingQueueFull) {
            return;
        }

        const item = this.queue.shift();
        if (!item) {
            return;
        }

        try {
            this.addToPendingPromiseQueue(item);
            const response = await item.promiseGenerator();
            this.removeFromPendingPromiseQueue(item);
            item.resolve(response);
            this.scheduler.deQueue();
        } catch (ex) {
            this.removeFromPendingPromiseQueue(item);
            item.reject(ex);
            this.scheduler.deQueue();
        }
    }

    public cancel(cancelId: string) {
        this.queue = this.queue.filter(item => item.cancelId !== cancelId);
    }

    private addToPendingPromiseQueue(item: QueueItem) {
        this.pendingPromiseCount++;
        this.scheduler.addToPendingQueue(item);
    }

    private removeFromPendingPromiseQueue(item: QueueItem) {
        this.pendingPromiseCount--;
        this.scheduler.removeFromPendingQueue(item);
    }

    private addQueueHandler(item: QueueItem) {
        this.queue.push(item);
        this.scheduler.deQueue();
    }
}