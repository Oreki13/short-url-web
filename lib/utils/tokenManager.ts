import { getCookie, setCookie } from 'cookies-next';

interface TokenRefreshResponse {
    status: string;
    code: string;
    message: string | null;
    data: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    } | null;
}

export class TokenManager {
    private static readonly ACCESS_TOKEN_KEY = 'accessToken';
    private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private static readonly API_REFRESH_ENDPOINT = '/api/v1/auth/refresh-token';

    /**
     * Get current access token
     */
    static getAccessToken(): string | undefined {
        return getCookie(TokenManager.ACCESS_TOKEN_KEY) as string | undefined;
    }

    /**
     * Get current refresh token
     */
    static getRefreshToken(): string | undefined {
        return getCookie(TokenManager.REFRESH_TOKEN_KEY) as string | undefined;
    }

    /**
     * Set tokens from login response
     */
    static setTokens(data: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }): void {
        // Set access token
        setCookie(TokenManager.ACCESS_TOKEN_KEY, data.access_token, {
            secure: true,
            maxAge: data.expires_in,
            sameSite: 'strict',
        });

        // Set refresh token (longer expiry)
        setCookie(TokenManager.REFRESH_TOKEN_KEY, data.refresh_token, {
            secure: true,
            maxAge: 30 * 24 * 60 * 60, // 30 days
            sameSite: 'strict',
        });
    }

    /**
     * Clear all tokens
     */
    static clearTokens(): void {
        setCookie(TokenManager.ACCESS_TOKEN_KEY, '', { maxAge: -1 });
        setCookie(TokenManager.REFRESH_TOKEN_KEY, '', { maxAge: -1 });
    }

    /**
     * Refresh access token using refresh token
     */
    static async refreshAccessToken(): Promise<boolean> {
        const refreshToken = TokenManager.getRefreshToken();

        if (!refreshToken) {
            console.log('No refresh token available');
            return false;
        }

        try {
            const response = await fetch(TokenManager.API_REFRESH_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: refreshToken,
                }),
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data: TokenRefreshResponse = await response.json();

            if (data.status === 'OK' && data.data) {
                TokenManager.setTokens(data.data);
                return true;
            } else {
                console.error('Token refresh response error:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            TokenManager.clearTokens();
            return false;
        }
    }

    /**
     * Check if access token is expired (rough estimation)
     */
    static isTokenExpired(): boolean {
        const token = TokenManager.getAccessToken();
        if (!token) return true;

        try {
            // Simple JWT payload decode (without verification)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            // Check if token expires in next 5 minutes
            return payload.exp < (currentTime + 300);
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return true;
        }
    }

    /**
     * Get authorization header
     */
    static getAuthHeader(): Record<string, string> {
        const token = TokenManager.getAccessToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /**
     * Enhanced fetcher with automatic token refresh
     */
    static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
        // Check if token is expired and try to refresh
        if (TokenManager.isTokenExpired()) {
            const refreshed = await TokenManager.refreshAccessToken();
            if (!refreshed) {
                throw new Error('Authentication failed');
            }
        }

        // Add auth header
        const headers = {
            'Content-Type': 'application/json',
            ...TokenManager.getAuthHeader(),
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // If still unauthorized after refresh attempt, clear tokens
        if (response.status === 401) {
            TokenManager.clearTokens();
            throw new Error('Authentication failed');
        }

        return response;
    }
}

/**
 * Enhanced SWR fetcher with automatic token refresh
 */
export const authFetcher = async (url: string) => {
    try {
        const response = await TokenManager.fetchWithAuth(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
