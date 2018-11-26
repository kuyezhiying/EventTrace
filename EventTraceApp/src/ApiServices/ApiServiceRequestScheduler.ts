import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { ApiServiceCancelator } from "./ApiServiceCancelator";
import { GuidGenerator } from "./GuidGenerator";
import { PromiseQueue } from "./PromiseQueue";

export class ApiServiceRequestScheduler {
    private readonly slowApiTimeoutValue = 31 * 1000;
    private pendingRequestMap = new Map();

    private normalQueue: PromiseQueue;
    private slowQueue: PromiseQueue;

    private maxTotalQueueCount = Infinity;

    constructor(maxTotalQueueCount: number, maxNormalQueueCount: number, maxSlowQueueCount: number) {
        this.maxTotalQueueCount = maxTotalQueueCount;

        this.normalQueue = new PromiseQueue(maxNormalQueueCount, this);
        this.slowQueue = new PromiseQueue(maxSlowQueueCount, this);
    }

    public add(apiService: AxiosInstance, param: AxiosRequestConfig, cancelator: ApiServiceCancelator) {
        const item: QueueItem = {
            id: GuidGenerator.newGuid(),
            cancelId: cancelator ? cancelator.Id : undefined
        };

        const cancelToken = axios.CancelToken;
        param.cancelToken = new cancelToken((c: () => void) => item.cancelToken = c);
        item.promiseGenerator = () => apiService.request(param);

        if (param.timeout && param.timeout < this.slowApiTimeoutValue) {
            return this.normalQueue.add(item);
        } else {
            return this.slowQueue.add(item);
        }
    }

    public deQueue() {
        this.slowQueue.deQueue();
        this.normalQueue.deQueue();
    }

    public get isPendingQueueFull() {
        return this.pendingRequestMap.size >= this.maxTotalQueueCount;
    }

    public addToPendingQueue(item: QueueItem) {
        this.pendingRequestMap.set(item.id, item);
    }

    public removeFromPendingQueue(item: QueueItem) {
        this.pendingRequestMap.delete(item.id);
    }

    public cancel(cancelId: string) {
        this.normalQueue.cancel(cancelId);
        this.slowQueue.cancel(cancelId);
        this.pendingRequestMap.forEach(item => {
            if (item.cancelId === cancelId && item.cancelToken) {
                item.cancelToken();
            }
        });
    }
}