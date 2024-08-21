import useSWR from "swr";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import ShortUrlProvider from "@/lib/provider/short_url";
import router from "next/router";

export const useFetchListShortUrl = (page: number, limit: number) => {
    const {
        data,
        isLoading,
        error
    } = useSWR(ApiEndpoint.short + '?page=' + page + '&limit=' + limit, (url) => ShortUrlProvider.getData(url), {keepPreviousData:true})
    if (data !== undefined) {
        if (data.status === 'ERROR') {
            if (data.code === "TOKEN_EXPIRED" || data.code === "INVALID_TOKEN" || data.code === "INVALID_USER_TOKEN") {
                router.replace('/login')
            }
        }
    }

    return {
        data,
        error,
        isLoading
    }
}