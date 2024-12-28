import {useRouter} from "next/router";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import Auth from "@/lib/provider/auth";
import {deleteCookie, hasCookie} from "cookies-next";
import useSWRMutation from "swr/mutation";
import {useCallback, useEffect} from "react";
import {ApiResponse} from "@/type/ApiResponse";

export const useCheckUserLogin = () => {
    const router = useRouter()
    const checkVerify = useSWRMutation(ApiEndpoint.verify, Auth.verify)

    const checkIsUserLogin = useCallback(async () => {
        const checkToken = hasCookie('token')
        if (!checkToken) return await router.push('/login')

        if (checkToken) {
            const resData: ApiResponse = await checkVerify.trigger()
            if (resData === undefined) return await router.push('/login')
            if (resData.status === "OK") {
                await router.push('/')
            } else {
                deleteCookie('token')
                await router.push('/login')
            }
        }
    }, [])

    useEffect(() => {
        checkIsUserLogin().then(_ => {
        })
    }, [checkIsUserLogin])
}