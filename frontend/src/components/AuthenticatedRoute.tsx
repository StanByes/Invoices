import * as React from "react";
import type {PropsWithChildren} from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../stores/stores.ts";

const AuthenticatedRoute: React.FC<PropsWithChildren> = ({children}) => {
  const id = useAppSelector((state) => state.user.id);
  if (!id)
    return <Navigate to={"/login"}/>

  return <>{children}</>;
};

export default AuthenticatedRoute;
