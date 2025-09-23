import HeadHtml from '@/components/HeadHtml';
import { TextInput } from '@/components/TextInput';
import { DialogComponent } from "@/components/DialogComponent";
import { NextPage } from "next";
import Link from "next/link";
import { useFetchRegister } from "@/lib/hooks/useFetchRegister";

const Register: NextPage = () => {
    const {
        register,
        handleSubmit,
        onSubmit,
        isSubmitting,
        isLoading,
        isMutating,
        errors,
        isOpenDialog,
        onClickCloseDialog,
        errorMessage,
    } = useFetchRegister();

    const isProcessing = isSubmitting || isLoading || isMutating;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
            <HeadHtml title='Register' />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-2xl mb-4">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m13-10a4 4 0 10-8 0 4 4 0 008 0zm6 8v-2a3 3 0 00-2-2.82" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-400 text-sm">Sign up to manage and track your short links</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <TextInput
                            register={register}
                            label='Username'
                            name='Username'
                            textOnError={errors.Username?.message}
                        />

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
                            name='Password'
                            type='password'
                            textOnError={errors.Password?.message}
                        />

                        <TextInput
                            register={register}
                            label='Confirm Password'
                            name='Confirm Password'
                            type='password'
                            textOnError={errors["Confirm Password"]?.message}
                        />

                        <button
                            type='submit'
                            disabled={isProcessing}
                            className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 
                                     text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 
                                     transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 
                                     disabled:cursor-not-allowed disabled:transform-none shadow-lg 
                                     hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Sign Up
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-center text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <DialogComponent
                isOpen={isOpenDialog}
                onClickClose={onClickCloseDialog}
                title="Registration Failed"
                content={errorMessage}
                actionType="NO"
                textNo="Close"
            />
        </div>
    );
};

export default Register;
