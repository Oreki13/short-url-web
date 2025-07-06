import { ApiResponse, GetListShortUrlResponse } from "@/type/ApiResponse"
import { DefaultHeader, Fetcher } from './index'
import { AddShortUrlResponse } from "@/type/AddShortUrl";

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
            credentials: 'include',
            headers: {
                ...DefaultHeader(),
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(arg)
        })
            .then((v) => v)
            .catch(e => console.log(e));
    },
    editData: async (url: string, { arg }: { arg: { title: string, path: string, destination: string } }): Promise<AddShortUrlResponse> => {
        return Fetcher(url, {
            method: "PUT",
            credentials: 'include',
            headers: {
                ...DefaultHeader(),
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(arg)
        })
            .then((v) => v)
            .catch(e => console.log(e));
    },
    deleteData: async (url: string): Promise<ApiResponse> => {
        return Fetcher(url, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                ...DefaultHeader(),
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then((v) => v)
            .catch(e => console.log(e));
    }
}

export default ShortUrlProvider