import {GetListShortUrlResponse} from "@/type/ApiResponse"
import {DefaultHeader, Fetcher} from './index'
import {AddShortUrlResponse} from "@/type/AddShortUrl";

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
    },
    addData: async (url: string, { arg }: { arg: { title: string, path: string, destination: string } }): Promise<AddShortUrlResponse> => {

        return Fetcher(url, {
            method: "POST",
            headers: {
                ...DefaultHeader(),
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(arg)
        })
            .then((v) => v)
            .catch(e => console.log(e));
    }
}

export default ShortUrlProvider