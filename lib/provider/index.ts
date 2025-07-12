import { getCookie } from "cookies-next";
import jwt from 'jsonwebtoken'
import { TokenManager } from "../utils/tokenManager";
import { CookieManager } from "../utils/cookieManager";
import CsrfProvider from "./csrf";
import ApiEndpoint from "../helpers/api_endpoint";

const CookieManage = new CookieManager({
    // Provide default config or import from a config file
    allowedKeys: ['sessionId'],
    defaultOptions: {
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours default
    }
})

// Helper function to ensure CSRF token is available for POST/PUT/DELETE requests
const ensureCsrfToken = async (method: string): Promise<void> => {
    const methodsRequiringCsrf = ['POST', 'PUT', 'DELETE'];

    if (!methodsRequiringCsrf.includes(method.toUpperCase())) {
        return;
    }

    try {
        const csrf = await CsrfProvider.getCsrfToken(ApiEndpoint.csrfToken);

        if (csrf?.data?.csrfToken) {
            CookieManage.setCookie("csrf_token", csrf.data.csrfToken, {
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60, // 24 hours default
            });
        } else {
            throw new Error('Invalid CSRF token response');
        }
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        throw new Error('Unable to obtain CSRF token');
    }
};

const Fetcher = async (args: string, init: RequestInit | undefined) => {
    try {
        if (init?.method) {
            await ensureCsrfToken(init.method);
        }

        return fetch(args, init)
            .then(r => {
                if (!r.ok) {
                    console.error(`HTTP Error ${r.status}: ${r.statusText}`);
                }
                return r.json()
            })
            .catch(e => {
                console.error('Fetch error:', e);
                return e;
            });
    } catch (error) {
        console.error('Pre-fetch error (CSRF token):', error);
        throw error;
    }
};

const DefaultHeader = () => {
    const token = TokenManager.getAccessToken();
    const csrfToken = CookieManage.getCookie("csrf_token");

    const jwtData: any = token ? jwt.decode(token) : null;

    return {
        "Authorization": "Bearer " + token,
        "x-control-user": jwtData === null ? "" : jwtData.id,
        "x-csrf-token": csrfToken || "",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
}


export { Fetcher, DefaultHeader, CookieManage };