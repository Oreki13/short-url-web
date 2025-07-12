
import { useRouter } from "next/navigation";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import Auth from "@/lib/provider/auth";
import useSWRMutation from "swr/mutation";
import { useCallback, useEffect } from "react";
import { ApiResponse } from "@/type/ApiResponse";
import { TokenManager } from "../utils/tokenManager";

export const useCheckUserLogin = () => {
    const router = useRouter()
    const checkVerify = useSWRMutation(ApiEndpoint.verify, Auth.verify)

    const checkIsUserLogin = useCallback(async () => {
        const checkToken = TokenManager.getAccessToken()

        if (!checkToken) {
            return router.push('/login');
        }

        if (checkToken) {
            const resData: ApiResponse = await checkVerify.trigger()
            if (resData === undefined) return router.push('/login')
            if (resData.status !== "OK") {
                TokenManager.clearTokens()
                return router.push('/login')
            }
        }
    }, [router, checkVerify])

    useEffect(() => {
        checkIsUserLogin().then(_ => {
        })
    }, [checkIsUserLogin])
}