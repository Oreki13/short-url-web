import {deleteCookie, hasCookie} from "cookies-next";
import {Api_response} from "@/type/api_response";
import {useEffect} from "react";
import {useRouter} from "next/router";
import useSWRMutation from "swr/mutation";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import Auth from "@/lib/provider/auth";

export const useCheckUserLogin = () => {
    const router = useRouter()
    const checkVerify = useSWRMutation(ApiEndpoint.verify, Auth.verify)
    const checkIsUserLogin = async () => {
        const checkToken = hasCookie('token')

        if (checkToken) {
            const resData: Api_response = await checkVerify.trigger()
            if (resData.status === "OK") {
                router.push('/')
            } else {
                deleteCookie('token')
            }
        }
    }

    useEffect(() => {
        checkIsUserLogin()
    }, [checkIsUserLogin])
}