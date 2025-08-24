import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import UserLocalStorage from "../storages/UserLocalStorage.ts";

export type UserState = {
    token: string | null
    id?: number
    username?: string
    email?: string
    password?: string
    admin?: boolean
    createdAt?: Date
    updatedAt?: Date
}

type UserSimpleState = {
    token: string
    id: number
    admin: boolean
}

const userLocalStorage = new UserLocalStorage();
const initialValue = userLocalStorage.get();

const initialState: UserState = initialValue != null ? initialValue : {token: null};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        simpleLogin: (_state: UserState, action: PayloadAction<UserSimpleState>) => {
            userLocalStorage.set(action.payload);
            return action.payload;
        },
        completeLogin: (_state: UserState, action: PayloadAction<UserState>) => {
            userLocalStorage.set(action.payload);
            return action.payload;
        },
        logout: () => {
            userLocalStorage.delete();
            return {
                token: null
            };
        }
    }
});

export const {simpleLogin, completeLogin, logout} = userSlice.actions;
export default userSlice.reducer;
