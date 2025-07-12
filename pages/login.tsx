import HeadHtml from '@/components/HeadHtml'
import { TextInput } from '@/components/TextInput'
import { DialogComponent } from "@/components/DialogComponent";
import { NextPage } from "next";
import { useAuth } from "@/lib/context/AuthContext";
import { useFetchLogin } from "@/lib/hooks/useFetchLogin";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const {
        register,
        onSubmit,
        handleSubmit,
        errors,
        isSubmitting,
        isOpenDialog,
        onClickCloseDialog,
        errorMessage,
        isLoading: isLoginLoading,
    } = useFetchLogin();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while checking authentication or during login
    if (isLoading || (isAuthenticated && !isLoading)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
                <HeadHtml title='Loading...' />
                <div className="relative w-full max-w-md">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <svg className="animate-spin h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-white text-lg font-medium">
                                    {isAuthenticated ? 'Redirecting...' : 'Loading...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
            <HeadHtml title='Login' />

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Glass morphism card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500/20 rounded-2xl mb-4">
                            <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <TextInput
                            register={register}
                            label='Email Address'
                            name='E-Mail'
                            type='email'
                            textOnError={errors["E-Mail"]?.message}
                        />

                        <TextInput
                            register={register}
                            label='Password'
                            type='password'
                            name='Password'
                            textOnError={errors.Password?.message}
                        />

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={isSubmitting || isLoginLoading}
                            className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 
                                     text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 
                                     transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 
                                     disabled:cursor-not-allowed disabled:transform-none shadow-lg 
                                     hover:shadow-sky-500/25 flex items-center justify-center gap-2"
                        >
                            {isSubmitting || isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-center text-gray-400 text-sm">
                            Secure login powered by modern encryption
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Dialog */}
            <DialogComponent
                isOpen={isOpenDialog}
                onClickClose={onClickCloseDialog}
                title="Authentication Failed"
                content={errorMessage}
                actionType="NO"
                textNo="Try Again"
            />
        </div>
    )
}

export default Login;

