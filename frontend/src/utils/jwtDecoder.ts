import { jwtDecode } from "jwt-decode";

export default (token: string) => {
    return jwtDecode(token) as {
        id: number,
        admin: boolean
    }
}
