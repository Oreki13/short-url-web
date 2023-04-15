import { Inter } from 'next/font/google'
import HeadHtml from '@/components/headHtml'
import { TextInput } from '@/components/TextInput'
import { useEffect, useRef, useState } from 'react'
import Auth from '@/lib/provider/auth'
import useSWRMutation from 'swr/mutation'
import { ApiResponse } from '@/helper/apiResponseStruct'
import { useRouter } from 'next/router'
import { hasCookie, removeCookies, setCookie } from 'cookies-next'
import ApiEndpoint from '@/lib/helpers/api_endpoint'

const inter = Inter({ subsets: ['latin'] })

type Modify<T, R> = Omit<T, keyof R> & R;
type LoginResponse = Modify<ApiResponse, {
    data: { token: string } | null
}>


export default function Home() {
    const router = useRouter()
    const { trigger } = useSWRMutation(ApiEndpoint.login, Auth.login)
    const checkVerify = useSWRMutation(ApiEndpoint.verify, Auth.verify)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isEmailError, setIsEmailError] = useState(false)
    const [isPasswordError, setIsPasswordError] = useState(false)
    const textErrorEmail = useRef('Email not registered')
    const textErrorPassword = useRef('Wrong Password')
    const submit = async () => {
        setIsEmailError(false)
        setIsPasswordError(false)
        setLoading(true)
        const resData: LoginResponse = await trigger({ email: email, password: password })
        if (resData != null) {
            if (resData.status === 'OK') {
                setCookie('token', resData.data?.token)
                router.push('/')
            } else {
                if (resData.code === "USER_UNREGISTERED") {
                    setIsEmailError(true)
                } else if (resData.code === "WRONG_PASSWORD") {
                    setIsPasswordError(true)
                }
            }
        }
        setLoading(false)
    }

    const checkIsUserLogin = async () => {
        const checkToken = hasCookie('token')

        if (checkToken) {
            const resData: ApiResponse = await checkVerify.trigger()
            if (resData.status === "OK") {
                router.push('/')
            } else {
                removeCookies('token')
            }
        }
    }

    useEffect(() => {
        checkIsUserLogin()
        return () => { }
    }, [])

    return (
        <>
            <HeadHtml title='Login' />
            <main className={inter.className + ' flex w-screen h-screen items-center justify-center'}>
                <div className='w-1/3 text-center border-2 rounded-md p-3 border-blue-100 shadow-sm'>
                    <span className='font-bold text-2xl text-sky-800'>Login</span>
                    <TextInput label='E-mail' name='email' onChange={(v) => {
                        setEmail(v.currentTarget.value)
                    }} isError={isEmailError} textOnError={textErrorEmail.current} />
                    <div className='h-5'></div>
                    <TextInput label='Password' type='password' name='password' onChange={(v) => {
                        setPassword(v.currentTarget.value)
                    }} isError={isPasswordError} textOnError={textErrorPassword.current} />
                    <button className='mt-5 bg-sky-800 w-full py-2 text-white hover:bg-sky-900 mb-5 outline-sky-700 rounded-sm' type='submit' onClick={() => { submit() }}>{loading ? "loading" : "SUBMIT"}</button>
                </div>
            </main>
        </>
    )
}

