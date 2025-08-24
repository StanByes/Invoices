import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer.ts";
import {type TypedUseSelectorHook, useSelector} from "react-redux";

const store =  configureStore({
    reducer: {
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
