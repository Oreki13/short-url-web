import {GetListShortUrlResponse} from "@/type/ApiResponse"
import {DefaultHeader, Fetcher} from './index'

const ShortUrlProvider = {
    getData: async (url: string): Promise<GetListShortUrlResponse> => {

        return Fetcher(url, {
            method: "GET",
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

export default ShortUrlProvider