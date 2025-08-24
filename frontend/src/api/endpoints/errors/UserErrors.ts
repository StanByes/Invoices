import {AxiosError} from "axios";

export type LoginErrorState = "BAD_CREDENTIALS" | "BAD_PASSWORD";

export class LoginError extends AxiosError {
    state: LoginErrorState

    constructor(state: LoginErrorState) {
        super();
        this.state = state
    }
}
