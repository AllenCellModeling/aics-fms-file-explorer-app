import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { castArray } from "lodash";

export interface ResponseStub {
    // A URL to match against or a function that, given AxiosRequestConfig, returns true or false.
    when: string | ((config: AxiosRequestConfig) => boolean);

    // A whole or partial response that corresponds to the AxiosResponse interface. It is shallowly merged with a stub
    // object that also corresponds to the AxiosResponse interface for the purpose of avoiding needed to declare the
    // full AxiosReponse interface when created a ResponseStub.
    respondWith: Partial<AxiosResponse>;
}

/**
 * Returns a stubbed version of axios that intercepts all outgoing HTTP requests. It can be provided with one or many
 * ResponseStubs, which
 */
export default function mockHttpClient(responseStub: ResponseStub | ResponseStub[]): AxiosInstance {
    return axios.create({
        adapter(config: AxiosRequestConfig) {
            return new Promise((resolve) => {
                let response: AxiosResponse = {
                    data: [],
                    headers: {},
                    status: 200,
                    statusText: "OK",
                    config,
                };

                castArray(responseStub).some((stubConfig) => {
                    if (stubConfig.when === config.url) {
                        response = Object.assign({}, response, stubConfig.respondWith);
                        return true;
                    }
                });

                resolve(response);
            });
        },
    });
}
