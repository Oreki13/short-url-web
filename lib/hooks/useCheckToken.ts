import {hasCookie} from "cookies-next";
import router from "next/router";

export const useCheckToken = async () => {
    const hasToken = hasCookie('token')
    if (!hasToken) {
        router.replace("/login");
    }
}