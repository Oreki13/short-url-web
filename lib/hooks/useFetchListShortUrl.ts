'use client'

import useSWR from "swr";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import ShortUrlProvider from "@/lib/provider/short_url";
import {useRouter} from "next/navigation";
import {usePaginationStore} from "@/lib/stores/dashboard/paginationStore";

export const useFetchListShortUrl = () => {
    const {currentPage, limit}= usePaginationStore(state => state)
    const router = useRouter()
    const {
        data,
        isLoading,
        error,
        mutate
    } = useSWR(ApiEndpoint.short + '?page=' + currentPage + '&limit=' + limit + '&sort=' + 'desc', (url) => ShortUrlProvider.getData(url), {keepPreviousData:true})
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
        isLoading,
        mutate
    }
}