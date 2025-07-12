import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCheckUserLogin } from '../hooks/useCheckUserLogin';
import { TokenManager } from '../utils/tokenManager';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface User {
    // Define user properties based on your API response
    id?: string;
    email?: string;
    name?: string;
    // Add other user properties as needed
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (token: string, userData?: User, redirectTo?: string) => Promise<void>;
    logout: () => void;
    refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    skipRedirectOnNoToken?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children,
    skipRedirectOnNoToken = false
}) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { isLoading, isAuthenticated, error, recheck } = useCheckUserLogin(skipRedirectOnNoToken || isLoggingOut);
    // Disable token refresh to prevent circular dependency and loading issues
    // const { forceRefresh } = useTokenRefresh({ enabled: isAuthenticated === true });

    const login = async (token: string, userData?: User, redirectTo: string = '/') => {
        try {
            setIsNavigating(true);

            // Set user data immediately
            if (userData) {
                setUser(userData);
            }

            // Verify the new token
            await recheck();

            // Navigate to dashboard or specified route
            await router.push(redirectTo);

        } catch (error) {
            console.error('Login navigation error:', error);
        } finally {
            setIsNavigating(false);
        }
    };

    const logout = async () => {
        // Prevent multiple logout calls
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);
            setIsNavigating(true);

            // Clear tokens and user data immediately
            TokenManager.clearTokens();
            setUser(null);

            // Force window location change for clean logout
            window.location.href = '/login';

        } catch (error) {
            console.error('Logout error:', error);
            // Fallback to router.push if window.location fails
            router.push('/login');
        }
        // Note: Don't reset states here as component will unmount
    };

    const refreshAuth = () => {
        if (!isLoggingOut) {
            recheck();
        }
    };

    // Clear user data when not authenticated (but not during logout)
    useEffect(() => {
        if (!isAuthenticated && user && !isNavigating && !isLoggingOut) {
            setUser(null);
        }
    }, [isAuthenticated, user, isNavigating, isLoggingOut]);

    const contextValue: AuthContextType = {
        user,
        isLoading: isLoading && !skipRedirectOnNoToken && !isLoggingOut,
        isAuthenticated: isAuthenticated && !isLoggingOut,
        error,
        login,
        logout,
        refreshAuth
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> => {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const { isLoading, isAuthenticated } = useAuth();

        if (isLoading) {
            return <LoadingSpinner message="Authenticating..." fullScreen />;
        }

        if (!isAuthenticated) {
            return null; // The hook will handle redirect
        }

        return <Component {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
    return AuthenticatedComponent;
};
