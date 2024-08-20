type Api_response = {
    status: "OK" | "ERROR",
    code: string | null,
    message: string | null,
    data: any
}

const defaultResponse: Api_response = {
    status: "OK",
    code: null,
    message: null,
    data: null
}

type Modify<T, R> = Omit<T, keyof R> & R;
type LoginResponse = Modify<Api_response, {
    data: { token: string } | null
}>

type GetListShortUrlResponse = Modify<Api_response, {
    data: PageShortUrlData
}>

type PageShortUrlData = {
    page: number,
    total: number,
    last_page: number,
    datas: Array<ShortUrlData>
}

type ShortUrlData = {
    id: string
    title: string
    destination: string
    back_half: string
    count_clicks: number
    is_deleted: number
    user_id: string
    createdAt: Date
    updatedAt: Date
}


export { defaultResponse };
export type { Api_response, LoginResponse, GetListShortUrlResponse };
