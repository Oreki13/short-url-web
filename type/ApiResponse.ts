type ApiResponse = {
    status: "OK" | "ERROR",
    code: string | null,
    message: string | null,
    data: any
}

const defaultResponse: ApiResponse = {
    status: "OK",
    code: null,
    message: null,
    data: null
}

type Modify<T, R> = Omit<T, keyof R> & R;

type LoginResponse = Modify<ApiResponse, {
    data:string  | null
}>

type GetListShortUrlResponse = Modify<ApiResponse, {
    data: PageShortUrlData
}>

type PageShortUrlData = {
    data: Array<ShortUrlData>,
    paging: PagingData,
}

type ShortUrlData = {
    id: string
    title: string
    destination: string
    path: string
    count_clicks: number
    is_deleted: number
    user_id: string
    createdAt: Date
    updatedAt: Date
}

type PagingData = {
    current_page: number,
    total_page: number,
    size: number,
    total_data: number
}


export { defaultResponse };
export type { ApiResponse, LoginResponse, GetListShortUrlResponse, PagingData };
