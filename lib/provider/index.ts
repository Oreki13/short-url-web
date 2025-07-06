import { getCookie } from "cookies-next";
import jwt from 'jsonwebtoken'
import { TokenManager } from "../utils/tokenManager";
import { CookieManager } from "../utils/cookieManager";

const CookieManage = new CookieManager({
    // Provide default config or import from a config file
    allowedKeys: ['sessionId'],
    defaultOptions: {
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours default
    }
})

const Fetcher = (args: string, init: RequestInit | undefined) => fetch(args, init)
    .then(r => {
        // const headersObj = Object.fromEntries(r.headers.entries());


        return r.json()
    })
    .catch(e => e);

const DefaultHeader = () => {
    const token = TokenManager.getAccessToken();
    const csrfToken = CookieManage.getCookie("csrf_token");
    // console.log("session", session);

    const jwtData: any = jwt.decode(token!)

    // Set cookie for headers
    // let cookieHeader = "x-csrf-token=" + csrfToken + "; ";


    return {
        "Authorization": "Bearer " + token,
        "x-control-user": jwtData === null ? "" : jwtData.id,
        "x-csrf-token": csrfToken || "",
        // "Cookie": cookieHeader,
    }
}


export { Fetcher, DefaultHeader, CookieManage };