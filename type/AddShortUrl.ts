import {ApiResponse} from "@/type/ApiResponse";


type Modify<T, R> = Omit<T, keyof R> & R;

type AddShortUrlResponse = Modify<ApiResponse, {
    data: ShortUrlData
}>

type ShortUrlData = {
    id: string,
    title: string,
    path: string,
    destination: string,
}

export type { AddShortUrlResponse, ShortUrlData };