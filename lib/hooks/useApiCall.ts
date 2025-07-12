import { useCallback } from 'react';
import { TokenManager } from '../utils/tokenManager';
import { useAuth } from '../context/AuthContext';

interface ApiCallOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    requiresAuth?: boolean;
}

interface ApiResponse<T = any> {
    status: string;
    code: string;
    message: string | null;
    data: T | null;
}

export const useApiCall = () => {
    const { logout, refreshAuth } = useAuth();

    const apiCall = useCallback(async <T = any>(
        url: string,
        options: ApiCallOptions = {}
    ): Promise<ApiResponse<T>> => {
        const {
            method = 'GET',
            headers = {},
            body,
            requiresAuth = true
        } = options;

        // Add auth header if required
        if (requiresAuth) {
            const token = TokenManager.getAccessToken();
            if (!token) {
                logout();
                throw new Error('Authentication required');
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Add content type for POST/PUT requests
        if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && body) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            // Handle 401 Unauthorized
            if (response.status === 401) {
                // Try to refresh token first
                try {
                    await refreshAuth();
                    // Retry the request with new token
                    const newToken = TokenManager.getAccessToken();
                    if (newToken) {
                        headers['Authorization'] = `Bearer ${newToken}`;
                        const retryResponse = await fetch(url, {
                            method,
                            headers,
                            body: body ? JSON.stringify(body) : undefined,
                        });

                        if (retryResponse.status === 401) {
                            logout();
                            throw new Error('Authentication failed');
                        }

                        return await retryResponse.json();
                    }
                } catch (refreshError) {
                    logout();
                    throw new Error('Session expired');
                }
            }

            // Handle other HTTP errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    status: 'error',
                    code: response.status.toString(),
                    message: response.statusText,
                    data: null
                }));
                throw new Error(errorData.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }, [logout, refreshAuth]);

    return {
        apiCall,
        get: <T = any>(url: string, options?: Omit<ApiCallOptions, 'method'>) =>
            apiCall<T>(url, { ...options, method: 'GET' }),
        post: <T = any>(url: string, data?: any, options?: Omit<ApiCallOptions, 'method' | 'body'>) =>
            apiCall<T>(url, { ...options, method: 'POST', body: data }),
        put: <T = any>(url: string, data?: any, options?: Omit<ApiCallOptions, 'method' | 'body'>) =>
            apiCall<T>(url, { ...options, method: 'PUT', body: data }),
        delete: <T = any>(url: string, options?: Omit<ApiCallOptions, 'method'>) =>
            apiCall<T>(url, { ...options, method: 'DELETE' }),
        patch: <T = any>(url: string, data?: any, options?: Omit<ApiCallOptions, 'method' | 'body'>) =>
            apiCall<T>(url, { ...options, method: 'PATCH', body: data }),
    };
};
