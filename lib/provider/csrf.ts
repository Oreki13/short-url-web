import { CsrfTokenResponse } from "@/type/ApiResponse"
import { DefaultHeader, Fetcher } from './index'

const CsrfProvider = {
    getCsrfToken: async (url: string): Promise<CsrfTokenResponse> => {
        return Fetcher(url, {
            method: "GET",
            credentials: 'include',
            headers: {
                ...DefaultHeader(),
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        })
            .then((v) => v)
            .catch(e => console.log(e));
    }
}

export default CsrfProvider
