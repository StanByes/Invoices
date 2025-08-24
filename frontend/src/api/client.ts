import axios from "axios";
import {refreshToken} from "./endpoints/userEndpoints.ts";
import UserLocalStorage from "../storages/UserLocalStorage.ts";

const client = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});
const userLocalStorage = new UserLocalStorage();

client.interceptors.request.use((req) => {
    const user = userLocalStorage.get();
    if (user)
        req.headers["Authorization"] = `Bearer ${user.token}`;

    return req;
});

client.interceptors.response.use((res) => {
    return res;
}, async (err) => {
    if (err.response.status == 401) {
        const { data } = err.response;
        if (data.message == "Invalid Access Token") {
            try {
                const token = await refreshToken();
                err.config.headers["Authorization"] = `Bearer ${token}`;
                return client(err.config);
            } catch (err: unknown) {
                console.error(err);
                localStorage.removeItem("access-token");
                window.location.href = "/login";
            }
        }
    }

    return Promise.reject(err);
});

export default client;
