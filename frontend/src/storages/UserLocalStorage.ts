import BaseLocalStorage from "./BaseLocalStorage.ts";
import type {UserState} from "../reducers/userReducer.ts";

export default class UserLocalStorage extends BaseLocalStorage<UserState> {
    readonly key: string = "user";

    delete(): void {
        localStorage.removeItem(this.key);
    }

    get(): UserState | null {
        const value = localStorage.getItem(this.key);
        return value != null ? JSON.parse(value) : null;
    }

    set(value: UserState): void {
        localStorage.setItem(this.key, JSON.stringify(value));
    }
}
