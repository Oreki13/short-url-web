import { useCallback, useEffect, useRef } from 'react';
import { TokenManager } from '../utils/tokenManager';
import { useCheckUserLogin } from './useCheckUserLogin';

interface UseTokenRefreshOptions {
    // Refresh token 5 menit sebelum expired
    refreshBeforeExpiry?: number; // dalam detik
    // Auto refresh enabled/disabled
    enabled?: boolean;
}

export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
    const { refreshBeforeExpiry = 300, enabled = true } = options; // 5 menit default
    const { recheck } = useCheckUserLogin();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scheduleTokenRefresh = useCallback(() => {
        if (!enabled) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const token = TokenManager.getAccessToken();
        if (!token) return;

        try {
            // Decode JWT untuk mendapatkan exp time
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            const timeUntilRefresh = expiryTime - currentTime - (refreshBeforeExpiry * 1000);

            if (timeUntilRefresh > 0) {
                timeoutRef.current = setTimeout(() => {
                    console.log('Auto-refreshing token...');
                    recheck();
                }, timeUntilRefresh);
            } else {
                // Token sudah expired atau akan expired soon, refresh sekarang
                recheck();
            }
        } catch (error) {
            console.error('Error parsing token for refresh scheduling:', error);
        }
    }, [enabled, refreshBeforeExpiry, recheck]);

    const forceRefresh = useCallback(() => {
        recheck();
    }, [recheck]);

    useEffect(() => {
        scheduleTokenRefresh();

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [scheduleTokenRefresh]);

    // Re-schedule when token changes
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'access_token') {
                scheduleTokenRefresh();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [scheduleTokenRefresh]);

    return {
        forceRefresh,
        scheduleRefresh: scheduleTokenRefresh
    };
};
