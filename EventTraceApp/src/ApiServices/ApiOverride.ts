import { AxiosRequestConfig } from "axios";

interface ApiTimeoutModel {
    Url: string;
    Timeout: number | ((param: AxiosRequestConfig) => number);
}

const overrides: ApiTimeoutModel[] = [
    { Url: "api/etrace/events", Timeout: 30 * 1000 },
];

const overrideWithParameters: ApiTimeoutModel[] = [];

export class ApiOverride {
    private urlOverrides = {};

    private anonymousApis: string[] = [
    ];

    private cookieAuthApis: string[] = [
        "api/core/tokens",
        "api/core/refreshtoken",
    ];

    constructor() {
        for (const override of overrides) {
            this.urlOverrides[override.Url.toLowerCase()] = override.Timeout;
        }
    }

    public getApiTimeOut(param: AxiosRequestConfig) {
        let timeout;
        const urlKey = this.getRelativeUrl(param.baseURL, param.url);
        const value = this.urlOverrides[urlKey];
        if (value) {
            if (typeof (value) === "number") {
                timeout = value;
            } else {
                timeout = value(param);
            }
        } else {
            const idx = overrideWithParameters.findIndex(o => urlKey.startsWith(o.Url));
            if (idx > -1) {
                timeout = overrideWithParameters[idx].Timeout;
            }
        }

        if (!timeout) {
            timeout = 15 * 1000;
        }

        return timeout;
    }

    public isAnonymousApi(baseUrl: string, url: string) {
        const urlKey = this.getRelativeUrl(baseUrl, url);
        return this.anonymousApis.some(api => api.toLowerCase() === urlKey);
    }

    public isCookieAuthApi(baseUrl: string, url: string) {
        const urlKey = this.getRelativeUrl(baseUrl, url);
        return this.cookieAuthApis.some(api => api.toLowerCase() === urlKey);
    }

    private getRelativeUrl(baseUrl: string, url: string) {
        let urlKey = url.replace(baseUrl, "").toLowerCase();

        // remove parameters
        const index = urlKey.indexOf("?");
        if (index >= 0) {
            urlKey = urlKey.substring(0, index);
        }

        return urlKey;
    }
}