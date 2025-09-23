import { useRouter } from "next/router";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import Auth from "@/lib/provider/auth";
import useSWR from "swr";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiResponse } from "@/type/ApiResponse";
import { TokenManager } from "../utils/tokenManager";
import UserProvider from "@/lib/provider/user";
import { UserDetail } from "@/type/User";

interface AuthenticatedUserPayload {
    verification: ApiResponse;
    user: UserDetail;
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
    const fetchAuthenticatedUser = useCallback(async (): Promise<AuthenticatedUserPayload> => {
        const verification = await Auth.verify(ApiEndpoint.verify);

        if (!verification || verification.status !== "OK") {
            throw new Error(verification?.message || 'Authentication failed');
        }

        const userId = TokenManager.getUserIdFromAccessToken();
        if (!userId) {
            throw new Error('Unable to determine user id from token');
        }

        const userResponse = await UserProvider.getUserDetail(userId);

        if (!userResponse || userResponse.status !== 'OK' || !userResponse.data) {
            throw new Error(userResponse?.message || 'Unable to fetch user detail');
        }

        return {
            verification,
            user: userResponse.data,
        };
    }, []);

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? 'auth-user-detail' : null,
        fetchAuthenticatedUser,
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
            onSuccess: (data: AuthenticatedUserPayload) => {
                if (!data || data.verification?.status !== "OK") {
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
        data.verification?.status === "OK"
    );

    // Extract user data from API response if available
    const userData = useMemo(() => {
        if (!isAuthenticated || !data?.user) {
            return null;
        }

        return data.user;
    }, [data, isAuthenticated]);

    return {
        isLoading: shouldFetch && isLoading && !skipRedirectOnNoToken,
        isAuthenticated,
        user: userData,
        error: error?.message || null,
        recheck
    };
};
