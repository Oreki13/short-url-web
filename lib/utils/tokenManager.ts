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

interface TokenValidationResult {
    isValid: boolean;
    isExpired?: boolean;
    expiresAt?: number;
    timeUntilExpiry?: number;
    error?: string;
}

export class TokenManager {
    private static readonly ACCESS_TOKEN_KEY = 'accessToken';
    private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private static readonly API_REFRESH_ENDPOINT = '/api/v1/auth/refresh-token';

    /**
     * Validate JWT token structure and expiry
     */
    static validateToken(token: string): TokenValidationResult {
        try {
            if (!token || typeof token !== 'string') {
                return { isValid: false, error: 'Invalid token format' };
            }

            const parts = token.split('.');
            if (parts.length !== 3) {
                return { isValid: false, error: 'Invalid JWT structure' };
            }

            // Decode payload
            const payload = JSON.parse(atob(parts[1]));

            if (!payload.exp) {
                return { isValid: false, error: 'Token missing expiration' };
            }

            const expiresAt = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            const timeUntilExpiry = expiresAt - currentTime;
            const isExpired = timeUntilExpiry <= 0;

            return {
                isValid: !isExpired,
                isExpired,
                expiresAt,
                timeUntilExpiry: Math.max(0, timeUntilExpiry),
                error: isExpired ? 'Token expired' : undefined
            };
        } catch (error) {
            return {
                isValid: false,
                error: `Token validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Get current access token with validation
     */
    static getAccessToken(): string | undefined {
        const token = getCookie(TokenManager.ACCESS_TOKEN_KEY) as string | undefined;

        if (!token) return undefined;

        const validation = this.validateToken(token);
        if (!validation.isValid) {
            console.warn('Invalid access token detected:', validation.error);
            this.clearTokens();
            return undefined;
        }

        return token;
    }

    /**
     * Get current refresh token
     */
    static getRefreshToken(): string | undefined {
        return getCookie(TokenManager.REFRESH_TOKEN_KEY) as string | undefined;
    }

    /**
     * Check if access token exists and is valid
     */
    static isAuthenticated(): boolean {
        const token = this.getAccessToken();
        return !!token;
    }

    /**
     * Get token expiry information
     */
    static getTokenExpiry(): { expiresAt: number; timeUntilExpiry: number } | null {
        const token = getCookie(TokenManager.ACCESS_TOKEN_KEY) as string | undefined;

        if (!token) return null;

        const validation = this.validateToken(token);
        if (!validation.isValid || !validation.expiresAt || !validation.timeUntilExpiry) {
            return null;
        }

        return {
            expiresAt: validation.expiresAt,
            timeUntilExpiry: validation.timeUntilExpiry
        };
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
