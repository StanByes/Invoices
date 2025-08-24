import client from "../client.ts";
import type {UserState} from "../../reducers/userReducer.ts";
import {LoginError} from "./errors/UserErrors.ts";

type LoginBody = {
    username: string
    password: string
}

export const login = async (data: LoginBody): Promise<string> => {
    return client.post("/users/login", data).then(request => {
        return request.data.token;
    }).catch((err) => {
        if (err.response?.status == 404) {
            throw new LoginError("BAD_CREDENTIALS");
        } else if (err.response?.status == 401) {
            throw new LoginError("BAD_PASSWORD");
        }
    })
}

export const me = async(): Promise<UserState> => {
    const request = await client.get("/users/me");
    return request.data;
}

export const refreshToken = async () => {
    const request = await client.get("/users/refresh_token");
    return request.data.token as string;
}
