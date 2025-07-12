import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CookieManage } from '@/lib/provider';
import ApiEndpoint from '@/lib/helpers/api_endpoint';
import useSWRMutation from 'swr/mutation';
import Auth from '../provider/auth';

interface UseLogoutReturn {
    logout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useLogout = (): UseLogoutReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { trigger } = useSWRMutation(ApiEndpoint.logout, Auth.logout)

    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            // Make API request to logout endpoint
            const response = await trigger()

            if (response.status !== 'OK') {
                throw new Error('Failed to logout from server');
            }

            // Clear cookies regardless of API response
            CookieManage.deleteCookies(['accessToken', 'refreshToken', 'csrf_token']);

            // Redirect to login page
            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during logout');
            console.error('Logout error:', err);

            // Even if API call fails, clear cookies and redirect
            CookieManage.deleteCookies(['accessToken', 'refreshToken', 'csrf_token']);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        logout,
        isLoading,
        error,
    };
};
