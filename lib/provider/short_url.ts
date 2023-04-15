import { GetListShortUrlResponse } from "@/helper/apiResponseStruct"
import { DefaultHeader, Fetcher } from './index'

const ShortUrlProvider = {
    getData: async (url: string, page: number, limit: number): Promise<GetListShortUrlResponse> => {
        return Fetcher(url + '?page=' + page + '&limit=' + limit, {
            method: "GET",
            headers: DefaultHeader()
        }).then((v) => {
            return v
        }).catch(e => console.log(e)
        )
    }
}

export default ShortUrlProvider