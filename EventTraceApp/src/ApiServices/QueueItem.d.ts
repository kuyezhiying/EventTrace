interface QueueItem {
    id: string;
    cancelId: string;
    promiseGenerator?: () => Promise<any>;
    cancelToken?: () => any;
    resolve?: (any) => void;
    reject?: (any) => void;
}