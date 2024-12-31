'use client'

import {useRouter} from "next/navigation";
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
        if (!checkToken) return router.push('/login');

        if (checkToken) {
            const resData: ApiResponse = await checkVerify.trigger()
            if (resData === undefined) return router.push('/login')
            if (resData.status === "OK") {
                router.push('/')
            } else {
                deleteCookie('token')
                router.push('/login')
            }
        }
    }, [])

    useEffect(() => {
        checkIsUserLogin().then(_ => {
        })
    }, [checkIsUserLogin])
}