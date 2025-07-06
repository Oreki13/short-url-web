import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface CookieOptions {
    secure?: boolean;
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
}

interface CookieConfig {
    allowedKeys: string[]; // List of allowed cookie keys
    defaultOptions?: CookieOptions;
    keyMappings?: Record<string, string>; // Map server key to client key
    transformers?: Record<string, (value: string) => string>; // Transform values before storing
}

export class CookieManager {
    private config: CookieConfig;

    constructor(config: CookieConfig) {
        this.config = {
            defaultOptions: {
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60, // 24 hours default
            },
            ...config,
        };
    }

    /**
     * Parse Set-Cookie header from response
     */
    private parseSetCookieHeader(setCookieHeader: string): {
        name: string;
        value: string;
        options: CookieOptions;
    } | null {
        try {
            const parts = setCookieHeader.split(';').map(part => part.trim());
            const [nameValue] = parts;
            const [name, value] = nameValue.split('=');

            if (!name || value === undefined) {
                return null;
            }

            const options: CookieOptions = {};

            // Parse cookie attributes
            for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                const [key, val] = part.split('=');
                const lowerKey = key.toLowerCase();

                switch (lowerKey) {
                    case 'secure':
                        options.secure = true;
                        break;
                    case 'httponly':
                        options.httpOnly = true;
                        break;
                    case 'samesite':
                        options.sameSite = val?.toLowerCase() as 'strict' | 'lax' | 'none';
                        break;
                    case 'max-age':
                        options.maxAge = parseInt(val, 10);
                        break;
                    case 'expires':
                        options.expires = new Date(val);
                        break;
                    case 'domain':
                        options.domain = val;
                        break;
                    case 'path':
                        options.path = val;
                        break;
                }
            }

            return {
                name: name.trim(),
                value: value.trim(),
                options,
            };
        } catch (error) {
            console.error('Error parsing Set-Cookie header:', error);
            return null;
        }
    }

    /**
     * Process Set-Cookie headers from API response
     */
    processResponseCookies(response: Response): void {
        const setCookieHeaders = response.headers.get('set-cookie');

        if (!setCookieHeaders) {
            return;
        }

        // Handle multiple Set-Cookie headers
        const cookieHeaders = Array.isArray(setCookieHeaders)
            ? setCookieHeaders
            : [setCookieHeaders];

        cookieHeaders.forEach(header => {
            const parsed = this.parseSetCookieHeader(header);
            if (parsed) {
                this.processSingleCookie(parsed.name, parsed.value, parsed.options);
            }
        });
    }

    /**
     * Process multiple Set-Cookie headers (when available as array)
     */
    processMultipleSetCookies(setCookieArray: string[]): void {
        setCookieArray.forEach(header => {
            const parsed = this.parseSetCookieHeader(header);
            if (parsed) {
                this.processSingleCookie(parsed.name, parsed.value, parsed.options);
            }
        });
    }

    /**
     * Process a single cookie
     */
    private processSingleCookie(name: string, value: string, options: CookieOptions): void {
        // Check if this cookie key is allowed
        if (!this.config.allowedKeys.includes(name)) {
            console.log(`Cookie key '${name}' is not in allowed list, skipping...`);
            return;
        }

        // Apply key mapping if configured
        const clientKey = this.config.keyMappings?.[name] || name;

        // Apply value transformer if configured
        const transformedValue = this.config.transformers?.[name]
            ? this.config.transformers[name](value)
            : value;

        // Merge with default options
        const finalOptions = {
            ...this.config.defaultOptions,
            ...options,
        };

        // Set the cookie
        this.setCookie(clientKey, transformedValue, finalOptions);
    }

    /**
     * Set a cookie with options
     */
    setCookie(key: string, value: string, options?: CookieOptions): void {
        const finalOptions = {
            ...this.config.defaultOptions,
            ...options,
        };

        setCookie(key, value, finalOptions);
    }

    /**
     * Get a cookie value
     */
    getCookie(key: string): string | undefined {
        return getCookie(key) as string | undefined;
    }

    /**
     * Delete a cookie
     */
    deleteCookie(key: string): void {
        deleteCookie(key);
        console.log(`Cookie deleted: ${key}`);
    }

    /**
     * Get multiple cookies
     */
    getCookies(keys: string[]): Record<string, string | undefined> {
        const result: Record<string, string | undefined> = {};
        keys.forEach(key => {
            result[key] = this.getCookie(key);
        });
        return result;
    }

    /**
     * Delete multiple cookies
     */
    deleteCookies(keys: string[]): void {
        keys.forEach(key => this.deleteCookie(key));
    }

    /**
     * Clear all allowed cookies
     */
    clearAllowedCookies(): void {
        this.config.allowedKeys.forEach(key => {
            // Check if mapped key exists
            const clientKey = this.config.keyMappings?.[key] || key;
            this.deleteCookie(clientKey);
        });
    }

    /**
     * Check if a cookie exists
     */
    hasCookie(key: string): boolean {
        return this.getCookie(key) !== undefined;
    }

    /**
     * Get all cookies that match allowed keys
     */
    getAllowedCookies(): Record<string, string | undefined> {
        const result: Record<string, string | undefined> = {};

        this.config.allowedKeys.forEach(key => {
            const clientKey = this.config.keyMappings?.[key] || key;
            result[clientKey] = this.getCookie(clientKey);
        });

        return result;
    }

    /**
     * Update allowed keys configuration
     */
    updateAllowedKeys(newKeys: string[]): void {
        this.config.allowedKeys = newKeys;
    }

    /**
     * Add new allowed key
     */
    addAllowedKey(key: string): void {
        if (!this.config.allowedKeys.includes(key)) {
            this.config.allowedKeys.push(key);
        }
    }

    /**
     * Remove allowed key
     */
    removeAllowedKey(key: string): void {
        this.config.allowedKeys = this.config.allowedKeys.filter(k => k !== key);
    }

    /**
     * Enhanced fetch wrapper that automatically processes Set-Cookie headers
     */
    async fetchWithCookieHandling(
        url: string,
        options: RequestInit = {}
    ): Promise<Response> {
        try {
            const response = await fetch(url, {
                credentials: 'include', // Important for cookies
                ...options,
            });

            // Process any Set-Cookie headers in the response
            this.processResponseCookies(response);

            return response;
        } catch (error) {
            console.error('Fetch with cookie handling error:', error);
            throw error;
        }
    }

    /**
     * Get configuration
     */
    getConfig(): CookieConfig {
        return { ...this.config };
    }
}

// Pre-configured instances for common use cases

/**
 * Auth-focused cookie manager
 */
export const authCookieManager = new CookieManager({
    allowedKeys: ['access_token', 'refresh_token', 'user_session', 'csrf_token'],
    keyMappings: {
        'access_token': 'token',
        'refresh_token': 'refresh_token',
        'user_session': 'session',
        'csrf_token': 'csrf',
    },
    defaultOptions: {
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    transformers: {
        'access_token': (value) => {
            // Could add JWT validation or processing here
            return value;
        },
    },
});

/**
 * General purpose cookie manager
 */
export const generalCookieManager = new CookieManager({
    allowedKeys: [
        'theme',
        'language',
        'user_preferences',
        'analytics_id',
        'session_tracking'
    ],
    defaultOptions: {
        secure: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
});

/**
 * Session-only cookie manager (no persistent storage)
 */
export const sessionCookieManager = new CookieManager({
    allowedKeys: ['temp_data', 'form_state', 'popup_shown'],
    defaultOptions: {
        secure: true,
        sameSite: 'strict',
        // No maxAge means session-only cookies
    },
});
