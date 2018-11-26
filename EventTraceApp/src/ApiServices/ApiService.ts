import * as Es6 from "es6-promise";

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { ApiOverride } from "./ApiOverride";
import { ApiServiceCancelator } from "./ApiServiceCancelator";
import { ApiServiceRequestScheduler } from "./ApiServiceRequestScheduler";
import { GuidGenerator } from "./GuidGenerator";

class ApiService {
    private totalMaxPendingPromisesCount = 6;
    private totalMaxNormalPendingPromisesCount = 6;
    private totalMaxSlowPendingPromisesCount = 1;

    private apiOverride: ApiOverride = new ApiOverride();
    private promiseQueue: ApiServiceRequestScheduler = new ApiServiceRequestScheduler(
        this.totalMaxPendingPromisesCount, this.totalMaxNormalPendingPromisesCount, this.totalMaxSlowPendingPromisesCount);
    private axiosInstance: AxiosInstance = null;

    constructor() {
        this.initialize();
    }

    public request(param: AxiosRequestConfig, cancelator?: ApiServiceCancelator) {
        if (param.url.toLowerCase().startsWith("api/etrace")) {
            this.axiosInstance = axios.create({
                baseURL: "https://localhost:53065/"
            });
        }
        if (param.url.toLowerCase() === "api/core/refreshtoken") {
            return this.axiosInstance.request(param);
        }
        param.timeout = this.apiOverride.getApiTimeOut(param);
        return this.promiseQueue.add(this.axiosInstance, param, cancelator);
    }

    public cancel(serviceId: string) {
        this.promiseQueue.cancel(serviceId);
    }

    // Axios URl https://www.npmjs.com/package/axios
    private initialize() {
        const ServiceApiUrl = process.env.ServiceApiUrl;

        this.axiosInstance = axios.create({
            baseURL: ServiceApiUrl
        });

        this.axiosInstance.interceptors.request.use(async (config) => {
            await this.configAuth(config);

            // Add the correlation header
            const correlationId = GuidGenerator.newGuid();
            config.headers["X-Correlation"] = correlationId;

            return config;
        });

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError): Object => {
                return Es6.Promise.reject(error);
            }
        );
    }

    private async configAuth(config: AxiosRequestConfig) {
        if (this.apiOverride.isAnonymousApi(config.baseURL, config.url)) {
            //Anonymous API doesn't need to config auth
            return;
        }

        if (this.apiOverride.isCookieAuthApi(config.baseURL, config.url)) {
            //Cookie auth APIs, or temp password login, we will use cookie
            config.withCredentials = true;
            return;
        }
    }
}

const instance = new ApiService();
export { instance as ApiService };