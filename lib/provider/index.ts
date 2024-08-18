import {getCookie} from "cookies-next";
import jwt from 'jsonwebtoken'

const Fetcher = (args: string, init: RequestInit | undefined) => fetch(args, init)
    .then(r => r.json())
    .catch(e => e);

const DefaultHeader = () => {
    const token = getCookie('token')?.toString()
    const jwtData: any = jwt.decode(token!)

    return {
        "authorization": "Bearer " + token,
        "x-control-user": jwtData.id
    }
}


export {Fetcher, DefaultHeader};