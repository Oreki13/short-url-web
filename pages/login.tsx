import {Inter} from 'next/font/google'
import HeadHtml from '@/components/headHtml'
import {TextInput} from '@/components/textInput'
import {NextPage} from "next";
import {DialogComponent} from "@/components/dialog";
import {useCheckUserLogin} from "@/hooks/useCheckUserLogin";
import {useFetchLogin} from "@/hooks/useFetchLogin";

const inter = Inter({subsets: ['latin']})

const Login: NextPage = () => {

    useCheckUserLogin();
    const {
        register,
        onSubmit,
        handleSubmit,
        errors,
        isSubmitting,
        isOpenDialog,
        onClickCloseDialog,
    } = useFetchLogin();

    return (
        <div>
            <HeadHtml title='Login'/>
            <main className={inter.className + ' flex w-screen h-screen items-center justify-center'}>
                <form className='w-1/3 text-center border-2 rounded-md p-3 border-blue-100 shadow-sm'
                      onSubmit={handleSubmit(onSubmit)}>
                    <span className='font-bold text-2xl text-sky-800'>Login</span>
                    <TextInput register={register} label='E-Mail' textOnError={errors["E-Mail"]?.message}/>
                    <div className='h-5'></div>
                    <TextInput register={register} label='Password' type='password' name='password'
                               textOnError={errors.Password?.message}/>
                    <button
                        className='mt-5 bg-sky-800 w-full py-2 text-white hover:bg-sky-900 mb-5 outline-sky-700 rounded-lg'
                        type='submit' onClick={onClickCloseDialog}>{isSubmitting ? "loading" : "SUBMIT"}</button>
                </form>
            </main>
            <DialogComponent isOpen={isOpenDialog} onClickClose={onClickCloseDialog}/>
        </div>
    )
}

export default Login;

