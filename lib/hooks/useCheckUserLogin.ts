import { useRouter } from "next/router";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import Auth from "@/lib/provider/auth";
import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";
import { ApiResponse } from "@/type/ApiResponse";
import { TokenManager } from "../utils/tokenManager";

interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export const useCheckUserLogin = (skipRedirectOnNoToken: boolean = false) => {
    const router = useRouter();
    const [shouldFetch, setShouldFetch] = useState(false);

    // Check if we have a token before making any API calls
    useEffect(() => {
        const token = TokenManager.getAccessToken();
        if (token && !skipRedirectOnNoToken) {
            setShouldFetch(true);
        } else if (!skipRedirectOnNoToken && !token) {
            // No token, redirect immediately only if not skipping
            TokenManager.clearTokens();
            router.push('/login');
        } else if (skipRedirectOnNoToken) {
            // On login page, don't fetch unless we have a token
            setShouldFetch(false);
        }
    }, [router, skipRedirectOnNoToken]);

    // Use SWR only when we have a token
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? ApiEndpoint.verify : null,
        Auth.verify,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: 0, // Disable automatic polling
            shouldRetryOnError: false,
            onError: (error) => {
                console.error('Auth verification failed:', error);
                TokenManager.clearTokens();
                setShouldFetch(false);
                if (!skipRedirectOnNoToken) {
                    router.push('/login');
                }
            },
            onSuccess: (data: ApiResponse) => {
                if (!data || data.status !== "OK") {
                    TokenManager.clearTokens();
                    setShouldFetch(false);
                    if (!skipRedirectOnNoToken) {
                        router.push('/login');
                    }
                }
            }
        }
    );

    const recheck = useCallback(async () => {
        const token = TokenManager.getAccessToken();
        if (token) {
            setShouldFetch(true);
            await mutate();
        } else if (!skipRedirectOnNoToken) {
            TokenManager.clearTokens();
            router.push('/login');
        }
    }, [mutate, router, skipRedirectOnNoToken]);

    // Determine authentication status
    const isAuthenticated = Boolean(
        shouldFetch &&
        !error &&
        data &&
        data.status === "OK"
    );

    return {
        isLoading: shouldFetch && isLoading && !skipRedirectOnNoToken,
        isAuthenticated,
        error: error?.message || null,
        recheck
    };
};
