import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = "Loading...",
    size = 'md',
    fullScreen = false
}) => {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-xl'
    };

    const containerClasses = fullScreen
        ? "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center"
        : "flex items-center justify-center p-8";

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
                    <svg
                        className={`animate-spin ${sizeClasses[size]} text-sky-400`}
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span className={`text-white ${textSizeClasses[size]} font-medium`}>
                        {message}
                    </span>
                </div>
            </div>
        </div>
    );
};
