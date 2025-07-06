
import { useCallback, useEffect } from "react";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import CsrfProvider from "@/lib/provider/csrf";
import { CookieManage } from "../provider";

export const useFetchCsrfToken = (triggered: boolean) => {
    const getCsrfToken = useCallback(async () => {
        try {
            const csrf = await CsrfProvider.getCsrfToken(ApiEndpoint.csrfToken);
            CookieManage.setCookie("csrf_token", csrf.data.csrfToken || '', {
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60, // 24 hours default
            });
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
    }, []);

    useEffect(() => {
        if (!triggered) return;
        getCsrfToken();
    }, [getCsrfToken, triggered]);

    return {
        getCsrfToken
    }
}
